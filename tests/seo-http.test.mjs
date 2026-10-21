import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { createServer } from 'node:net'
import { once } from 'node:events'
import { before, after, test } from 'node:test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

let serverProcess, baseUrl, logs = ''
before(async () => {
  const reservation = createServer()
  reservation.listen(0, '127.0.0.1')
  await once(reservation, 'listening')
  const port = reservation.address().port
  await new Promise(resolve => reservation.close(resolve))
  baseUrl = `http://127.0.0.1:${port}`
  serverProcess = spawn(process.execPath, ['--import', pathToFileURL(path.resolve('tests/seo-preload.mjs')).href,
    'node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], {
    cwd: process.cwd(), windowsHide: true, env: { ...process.env, NODE_ENV: 'production', MARIBELA_SEO_TEST: '1',
      DATABASE_URL: 'postgresql://isolated:isolated@127.0.0.1:1/isolated',
      AUTH_JWT_SECRET: randomBytes(48).toString('hex') }, stdio: ['ignore', 'pipe', 'pipe'],
  })
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Local server startup timeout: ' + logs)), 45000)
    const collect = chunk => {
      logs = (logs + chunk.toString()).slice(-12000)
      if (logs.includes('Ready in')) { clearTimeout(timeout); resolve() }
    }
    serverProcess.stdout.on('data', collect)
    serverProcess.stderr.on('data', collect)
    serverProcess.once('error', error => { clearTimeout(timeout); reject(error) })
    serverProcess.once('exit', code => { clearTimeout(timeout); reject(new Error(`Local server exited ${code}: ${logs}`)) })
  })
}, { timeout: 50000 })

after(async () => {
  if (serverProcess && serverProcess.exitCode === null) {
    const exited = once(serverProcess, 'exit')
    serverProcess.kill()
    await exited
  }
})

async function read(route, options = {}) {
  assert.ok(route.startsWith('/') && !route.startsWith('//'))
  const response = await fetch(baseUrl + route, { ...options, signal: AbortSignal.timeout(20000) })
  return { response, html: await response.text() }
}

test('HTTP: sitemap/robots are served correctly by Next with only in-memory data', async () => {
  const { response, html } = await read('/sitemap.xml')
  assert.equal(response.status, 200, logs)
  assert.match(response.headers.get('content-type'), /xml/)
  assert.match(html, /https:\/\/www.maribela.com.br\/blog\/fixture-article/)
  assert.doesNotMatch(html, /draft|fixture-product|empty-blog-category|\/admin|\/api|checkout|carrinho|categoria\/todos/)
  const robots = await read('/robots.txt')
  assert.equal(robots.response.status, 200)
  assert.match(robots.html, /Sitemap: https:\/\/www.maribela.com.br\/sitemap.xml/)
  assert.match(robots.html, /Disallow: \/api\//)
})

test('HTTP: canonicals, metadata, schemas and categories are in server HTML', async () => {
  const home = await read('/?utm_source=test')
  assert.equal(home.response.status, 200, logs)
  assert.match(home.html, /rel="canonical" href="https:\/\/www.maribela.com.br\/?"/)
  assert.match(home.html, /Organization/)
  assert.match(home.html, /WebSite/)
  const store = await read('/loja')
  assert.equal(store.response.status, 200)
  assert.match(store.html, /href="\/loja\/categoria\/fixture-category"/)
  const all = await read('/loja/categoria/todos?utm_source=test')
  assert.equal(all.response.status, 200)
  assert.match(all.html, /rel="canonical" href="https:\/\/www.maribela.com.br\/loja"/)
  const article = await read('/blog/fixture-article')
  assert.equal(article.response.status, 200)
  assert.match(article.html, /<title>Título editorial de teste/)
  assert.match(article.html, /BlogPosting/)
  assert.match(article.html, /BreadcrumbList/)
})

test('HTTP: absent products/categories/articles return 404 for browsers and crawlers', async () => {
  for (const route of ['/loja/produto/missing-fixture', '/loja/categoria/missing-fixture',
    '/blog/categoria/missing-fixture', '/blog/missing-fixture']) {
    for (const agent of ['SEO local test', 'Googlebot']) {
      const result = await read(route, { headers: { 'User-Agent': agent } })
      assert.equal(result.response.status, 404, `${route} ${agent}: ${logs}`)
    }
  }
})

test('HTTP: valid unreviewed products/empty categories remain accessible with noindex', async () => {
  for (const route of ['/loja/produto/fixture-product', '/loja/categoria/empty-category', '/blog/categoria/empty-blog-category']) {
    const { response, html } = await read(route)
    assert.equal(response.status, 200, `${route}: ${logs}`)
    assert.match(html, /name="robots" content="noindex, follow"/)
  }
})

test('HTTP: operational pages receive noindex headers without changing their access flow', async () => {
  for (const route of ['/admin/login', '/loja/carrinho', '/loja/checkout', '/loja/meus-pedidos']) {
    const { response } = await read(route)
    assert.equal(response.status, 200, `${route}: ${logs}`)
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow')
  }
})
