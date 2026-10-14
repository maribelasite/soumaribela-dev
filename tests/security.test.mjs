import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { test, mock } from 'node:test'
import jwt from 'jsonwebtoken'

// Isolated cryptographic fixtures and in-memory database doubles, never production credentials/data.
process.env.AUTH_JWT_SECRET = randomBytes(48).toString('hex')
process.env.DATABASE_URL = 'postgresql://isolated:isolated@127.0.0.1:1/isolated'
globalThis.fetch = async () => { throw new Error('Network is disabled in security tests') }
globalThis.prisma = Object.fromEntries(['adminUser', 'product', 'order', 'blogCategory', 'post', 'customPage', 'client']
  .map(model => [model, Object.fromEntries(['findUnique', 'findMany', 'findFirst', 'count', 'create', 'update', 'delete']
    .map(method => [method, async () => { throw new Error(`Unexpected database operation: ${model}.${method}`) }]))]))
const { prisma } = await import('../src/core/lib/prisma.ts')
const { authenticateAdmin, withAdmin } = await import('../src/core/lib/admin-access.ts')
const { verifyAdminToken } = await import('../src/core/lib/auth-token.ts')
const { createAuthToken, verifyAuthToken, createAuthCookie } = await import('../src/core/lib/session.ts')
const { middleware } = await import('../src/middleware.ts')
const { NextRequest } = await import('next/server.js')

const user = { id: 'test-admin', email: 'admin@example.invalid', role: 'admin' }
const validToken = createAuthToken(user)
const request = (url, method = 'GET', token, body, origin) => new NextRequest(`https://shop.example.invalid${url}`, {
  method,
  headers: { ...(token ? { cookie: `auth_token=${token}` } : {}),
    ...(body ? { 'Content-Type': 'application/json' } : {}), ...(origin ? { origin } : {}) },
  ...(body ? { body: JSON.stringify(body) } : {}),
})
const invalidTokens = [
  'arbitrary-cookie',
  jwt.sign(user, randomBytes(48), { expiresIn: '1h' }),
  jwt.sign(user, process.env.AUTH_JWT_SECRET, { expiresIn: -1 }),
  jwt.sign(user, process.env.AUTH_JWT_SECRET, { algorithm: 'HS384', expiresIn: '1h' }),
  jwt.sign(user, process.env.AUTH_JWT_SECRET),
  jwt.sign({ id: user.id }, process.env.AUTH_JWT_SECRET, { expiresIn: '1h' }),
  jwt.sign({ ...user, iat: Math.floor(Date.now() / 1000) - 8 * 86400 }, process.env.AUTH_JWT_SECRET, { expiresIn: '20d' }),
]

test('JWT: rejects forged, expired, wrong-algorithm, incomplete and over-age sessions', async () => {
  for (const token of invalidTokens) {
    assert.equal(await verifyAdminToken(token), null)
    assert.equal(verifyAuthToken(token), null)
  }
  assert.equal((await verifyAdminToken(validToken)).id, user.id)
  assert.equal(verifyAuthToken(validToken).id, user.id)
  const cookie = createAuthCookie(validToken)
  assert.equal(cookie.httpOnly, true)
  assert.equal(cookie.sameSite, 'lax')
})

test('authorization rechecks current database identity and role', async () => {
  const lookup = mock.method(prisma.adminUser, 'findUnique', async () => user)
  try {
    assert.equal((await authenticateAdmin(undefined)).status, 401)
    assert.equal((await authenticateAdmin('forged')).status, 401)
    assert.equal(lookup.mock.callCount(), 0)
    assert.equal((await authenticateAdmin(validToken)).status, 200)
    lookup.mock.mockImplementation(async () => null)
    assert.equal((await authenticateAdmin(validToken)).status, 401)
    lookup.mock.mockImplementation(async () => ({ ...user, role: 'viewer' }))
    assert.equal((await authenticateAdmin(validToken)).status, 403)
    lookup.mock.mockImplementation(async () => ({ ...user, email: 'changed@example.invalid' }))
    assert.equal((await authenticateAdmin(validToken)).status, 401)
    assert.equal((await authenticateAdmin(createAuthToken({ ...user, role: 'viewer' }))).status, 403)
  } finally { lookup.mock.restore() }
})

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? listFiles(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
}
const routes = [...listFiles('src/app/api/admin').filter(file => file.endsWith('route.ts')),
  'src/app/api/products/route.ts', 'src/app/api/orders/route.ts', 'src/app/api/clients/route.ts',
  'src/app/api/cloudinary/upload/route.ts', 'src/app/api/asaas/validate-key/route.ts']

test('all protected API operations reject visitors and fabricated cookies before database access', async () => {
  const lookup = mock.method(prisma.adminUser, 'findUnique', async () => { throw new Error('Unexpected database access') })
  try {
    let operations = 0
    for (const file of routes) {
      const routeModule = await import(`../${file.replaceAll('\\', '/')}`)
      for (const verb of ['GET', 'POST', 'PATCH', 'DELETE']) {
        if (!routeModule[verb]) continue
        if (file.includes('/api/products/') && verb === 'GET') continue
        if (file.includes('/api/orders/') && verb === 'POST') continue
        for (const token of [undefined, ...invalidTokens]) {
          const response = await routeModule[verb](request('/api/protected', verb, token), { params: Promise.resolve({ id: 'test-id' }) })
          assert.equal(response.status, 401, `${file} ${verb}`)
          assert.match(response.headers.get('cache-control'), /no-store/)
        }
        operations++
      }
    }
    assert.ok(operations >= 20)
    assert.equal(lookup.mock.callCount(), 0)
  } finally { lookup.mock.restore() }
})

test('valid admin reaches handler; revoked role, cross-site mutation and database failure fail closed', async () => {
  let executed = 0
  const handler = withAdmin(async () => { executed++; return Response.json({ ok: true }) })
  const lookup = mock.method(prisma.adminUser, 'findUnique', async () => user)
  try {
    assert.equal((await handler(request('/api/admin', 'POST', validToken, {}, 'https://shop.example.invalid'))).status, 200)
    const duplicateCookies = request('/api/admin', 'GET', validToken)
    duplicateCookies.headers.set('cookie', `auth_token=${validToken}; auth_token=forged`)
    assert.equal((await handler(duplicateCookies)).status, 401)
    assert.equal((await handler(request('/api/admin', 'POST', validToken, {}, 'https://attacker.example.invalid'))).status, 403)
    lookup.mock.mockImplementation(async () => ({ ...user, role: 'viewer' }))
    assert.equal((await handler(request('/api/admin', 'POST', validToken))).status, 403)
    lookup.mock.mockImplementation(async () => { throw new Error('PRIVATE database detail') })
    const response = await handler(request('/api/admin', 'GET', validToken))
    assert.equal(response.status, 500)
    assert.doesNotMatch(await response.text(), /PRIVATE/)
    assert.equal(executed, 1)
  } finally { lookup.mock.restore() }
})

test('middleware validates signature, expiration and role; API returns 401 and pages redirect', async () => {
  for (const token of [undefined, ...invalidTokens]) {
    assert.equal((await middleware(request('/api/admin/products', 'GET', token))).status, 401)
    const page = await middleware(request('/admin/products', 'GET', token))
    assert.equal(page.status, 307)
    assert.equal(new URL(page.headers.get('location')).pathname, '/admin/login')
  }
  assert.equal((await middleware(request('/api/admin/products', 'GET', validToken))).status, 200)
  assert.equal((await middleware(request('/admin/login'))).status, 200)
  assert.equal((await middleware(request('/admin/setup-admin'))).status, 200)
  assert.equal((await middleware(request('/api/admin/products', 'GET', createAuthToken({ ...user, role: 'viewer' })))).status, 403)
})

test('public product GET and authorized admin listing/create/update/delete remain functional in memory', async () => {
  const publicApi = await import('../src/app/api/products/route.ts')
  const adminApi = await import('../src/app/api/admin/products/route.ts')
  const itemApi = await import('../src/app/api/admin/products/[id]/route.ts')
  const orderApi = await import('../src/app/api/orders/route.ts')
  const payload = { name: 'Test fixture', slug: 'test-fixture', description: 'In-memory fixture', price: 10,
    stock: 2, handmade: true, categories: [], imageUrls: ['https://example.invalid/image.jpg'] }
  const product = { id: 'test-product', ...payload, images: [{ id: 'test-image', url: payload.imageUrls[0] }] }
  const doubles = [
    mock.method(prisma.adminUser, 'findUnique', async () => user),
    mock.method(prisma.product, 'findMany', async () => [product]),
    mock.method(prisma.product, 'count', async () => 1),
    mock.method(prisma.product, 'create', async () => product),
    mock.method(prisma.product, 'findUnique', async () => product),
    mock.method(prisma.product, 'update', async () => product),
    mock.method(prisma.product, 'delete', async () => product),
    mock.method(prisma.order, 'findMany', async () => []),
  ]
  try {
    assert.equal((await publicApi.GET()).status, 200)
    assert.equal((await adminApi.GET(request('/api/admin/products', 'GET', validToken))).status, 200)
    assert.equal((await adminApi.POST(request('/api/admin/products', 'POST', validToken, payload))).status, 200)
    const context = { params: Promise.resolve({ id: product.id }) }
    assert.equal((await itemApi.PATCH(request('/api/admin/products/test-product', 'PATCH', validToken, payload), context)).status, 200)
    assert.equal((await itemApi.DELETE(request('/api/admin/products/test-product', 'DELETE', validToken), context)).status, 200)
    assert.equal((await orderApi.GET(request('/api/orders', 'GET', validToken))).status, 200)
    assert.equal((await orderApi.POST(request('/api/orders', 'POST', undefined, { items: [] }))).status, 400)
  } finally { doubles.forEach(double => double.mock.restore()) }
})

test('every private admin page checks server authorization before rendering/querying', () => {
  const pages = listFiles('src/app/(admin)/admin').filter(file => file.endsWith('page.tsx') &&
    !file.includes('login') && !file.includes('setup-admin'))
  assert.equal(pages.length, 16)
  for (const file of pages) {
    const source = readFileSync(file, 'utf8')
    assert.match(source, /await requireAdminPage\(\)/, file)
    assert.doesNotMatch(source, /['"]use client['"]/, file)
  }
})
