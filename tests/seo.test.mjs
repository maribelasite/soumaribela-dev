import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import fixture from './fixtures/seo-db.cjs'

globalThis.prisma = fixture.prisma
process.env.DATABASE_URL = 'postgresql://isolated:isolated@127.0.0.1:1/isolated'
globalThis.fetch = async () => { throw new Error('Network disabled in SEO unit tests') }

const seo = await import('../src/core/lib/seo.ts')
const { reviewedProductSlugs } = await import('../src/client/config/catalog-seo.config.ts')
const { default: sitemap, dynamic } = await import('../src/app/sitemap.ts')
const { default: robots } = await import('../src/app/robots.ts')
const { default: config } = await import('../next.config.ts')

test('canonical strips tracking/filter parameters, rejects foreign hosts and uses www', () => {
  assert.equal(seo.canonicalUrl('/loja?utm_source=test#section'), seo.SITE_URL + '/loja')
  assert.throws(() => seo.canonicalUrl('https://foreign.example.invalid/'))
  const metadata = seo.pageMetadata({ title: 'Página', description: 'Descrição', path: '/sobre' })
  assert.equal(metadata.title.absolute, 'Página | Maribela Art & Crochê')
  assert.equal(metadata.alternates.canonical, seo.SITE_URL + '/sobre')
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical)
  assert.equal(metadata.twitter.title, metadata.openGraph.title)
  assert.ok(existsSync('public/' + new URL(metadata.openGraph.images[0].url).pathname.slice(1)))
})

test('robots allows public resources and noindex pages to be crawled; excludes technical APIs', () => {
  const result = robots()
  assert.equal(result.sitemap, seo.SITE_URL + '/sitemap.xml')
  assert.equal(result.rules.allow, '/')
  assert.deepEqual(result.rules.disallow, ['/api/'])
  assert.ok(!result.rules.disallow.some(path => path.includes('admin') || path.includes('loja')))
})

test('operational noindex headers cover admin/login, cart, checkout, lookup and order alternatives', async () => {
  const headers = await config.headers()
  for (const path of ['/admin/:path*', '/carrinho', '/pedido/:path*', '/loja/carrinho', '/loja/checkout', '/loja/meus-pedidos', '/loja/pedido/:path*']) {
    assert.equal(headers.find(rule => rule.source === path).headers[0].value, 'noindex, nofollow')
  }
  assert.equal(seo.pageMetadata({ title: 'Vazia', description: 'Vazia', path: '/empty', index: false }).robots.index, false)
})

test('product indexing requires explicit review, real content, photo, positive price and available stock', () => {
  const product = fixture.product
  assert.equal(seo.isIndexableProduct(product), false)
  assert.equal(seo.productSchema(product), null)
  assert.equal(seo.isIndexableProduct(product, [product.slug]), true)
  for (const change of [{ images: [] }, { name: '' }, { description: '' }, { price: 0 }, { price: 'NaN' }, { stock: 0 }, { stock: -1 }])
    assert.equal(seo.isIndexableProduct({ ...product, ...change }, [product.slug]), false)
  assert.equal(seo.publicImageUrl('javascript:alert(1)'), undefined)
})

test('sitemap excludes drafts, unreviewed products, empty categories, private URLs and duplicate todos', async () => {
  assert.equal(dynamic, 'force-dynamic')
  const result = await sitemap()
  const urls = result.map(entry => entry.url)
  for (const route of ['/', '/loja', '/blog', '/sobre', '/personalizado', '/blog/fixture-article', '/blog/categoria/fixture-blog-category'])
    assert.ok(urls.includes(seo.canonicalUrl(route)), route)
  assert.ok(!urls.some(url => /draft|empty-category|empty-blog-category|fixture-product|\/admin|\/api|pedido|checkout|carrinho|categoria\/todos/.test(url)))
  assert.equal(new Set(urls).size, urls.length)
  assert.equal(result.find(entry => entry.url.endsWith('/blog/fixture-article')).lastModified, fixture.post.updatedAt)
  reviewedProductSlugs.push(fixture.product.slug)
  try {
    const approved = await sitemap()
    assert.ok(approved.some(entry => entry.url.endsWith('/loja/produto/fixture-product')))
    assert.ok(approved.some(entry => entry.url.endsWith('/loja/categoria/fixture-category')))
    fixture.product.stock = 0
    assert.ok(!(await sitemap()).some(entry => entry.url.endsWith('/loja/produto/fixture-product')))
  } finally { fixture.product.stock = 2; reviewedProductSlugs.length = 0 }
})

test('JSON-LD is valid, escapes script injection and contains no invented commercial claims', () => {
  const dangerous = '</script><script>alert(1)</script>&\u2028'
  const serialized = seo.serializeJsonLd({ name: dangerous })
  assert.ok(!serialized.includes('<'))
  assert.equal(JSON.parse(serialized).name, dangerous)
  const product = seo.productSchema(fixture.product, [fixture.product.slug])
  assert.equal(product.offers.price, '10.00')
  assert.equal(product.offers.priceCurrency, 'BRL')
  assert.equal(product.offers.availability, 'https://schema.org/InStock')
  for (const key of ['aggregateRating', 'review', 'address', 'shippingDetails', 'hasMerchantReturnPolicy'])
    assert.equal(JSON.stringify(product).includes(`"${key}"`), false)
  const article = seo.blogPostingSchema(fixture.post)
  assert.equal(article['@type'], 'BlogPosting')
  assert.equal(article.dateModified, fixture.post.updatedAt.toISOString())
  assert.equal(article.datePublished, undefined)
  assert.equal(article.author, undefined)
  assert.equal(seo.organizationSchema()['@type'], 'Organization')
  assert.equal(seo.websiteSchema()['@type'], 'WebSite')
  assert.equal(seo.breadcrumbSchema([{ name: 'Início', path: '/' }]).itemListElement[0].position, 1)
})

test('dynamic pages and metadata throw Next notFound for missing products, categories and posts', async () => {
  for (const file of ['loja/produto/[slug]', 'loja/categoria/[slug]', 'blog/categoria/[slug]', 'blog/[slug]']) {
    const route = await import(`../src/app/(site)/${file}/page.tsx`)
    const context = { params: Promise.resolve({ slug: 'missing-fixture' }) }
    const is404 = error => String(error.digest).includes('404')
    await assert.rejects(() => route.default(context), is404, file)
    await assert.rejects(() => route.generateMetadata(context), is404, file)
  }
})

test('real route metadata uses PostSEO, distinct institutional titles and todos canonical', async () => {
  const article = await import('../src/app/(site)/blog/[slug]/page.tsx')
  const result = await article.generateMetadata({ params: Promise.resolve({ slug: fixture.post.slug }) })
  assert.ok(result.title.absolute.startsWith(fixture.post.seo.metaTitle))
  assert.equal(result.description, fixture.post.seo.metaDesc)
  assert.equal(result.openGraph.type, 'article')
  const category = await import('../src/app/(site)/loja/categoria/[slug]/page.tsx')
  assert.equal((await category.generateMetadata({ params: Promise.resolve({ slug: 'todos' }) })).alternates.canonical, seo.SITE_URL + '/loja')
  const emptyCategory = await import('../src/app/(site)/blog/categoria/[slug]/page.tsx')
  assert.equal((await emptyCategory.generateMetadata({ params: Promise.resolve({ slug: 'empty-blog-category' }) })).robots.index, false)
  const titles = []
  for (const file of ['page', 'sobre/page', 'personalizado/page', 'loja/page', 'blog/page']) {
    const route = await import(`../src/app/(site)/${file}.tsx`)
    const metadata = route.metadata || await route.generateMetadata()
    titles.push(metadata.title.absolute)
    assert.ok(metadata.alternates.canonical.startsWith(seo.SITE_URL))
  }
  assert.equal(new Set(titles).size, titles.length)
})

test('published article renders H1, safe structured data and internal breadcrumbs on server', async () => {
  const route = await import('../src/app/(site)/blog/[slug]/page.tsx')
  const element = await route.default({ params: Promise.resolve({ slug: fixture.post.slug }) })
  const html = renderToStaticMarkup(element)
  assert.match(html, /<h1/)
  assert.match(html, /application\/ld\+json/)
  assert.match(html, /BlogPosting/)
  assert.match(html, /BreadcrumbList/)
  const { default: JsonLd } = await import('../src/core/components/JsonLd.tsx')
  assert.equal(renderToStaticMarkup(createElement(JsonLd, { data: null })), '')
})

test('legacy Asaas, buyer history and session flows remain identical to security commit', () => {
  const files = ['src/middleware.ts', 'src/core/lib/session.ts',
    'src/app/(site)/loja/meus-pedidos/page.tsx',
    'src/app/(site)/loja/pedido/[id]/page.tsx',
    'src/app/api/asaas/webhook/route.ts']
  for (const file of files) {
    const original = execFileSync('git', ['-c', 'safe.directory=D:/Dev Sistemas/upnode-clientes/maribela', 'show', '95622d3:' + file], { encoding: 'utf8' })
    assert.equal(readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), original.replaceAll('\r\n', '\n'), file)
  }
})
