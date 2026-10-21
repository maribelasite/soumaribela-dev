import fixture from './fixtures/seo-db.cjs'
if (process.env.MARIBELA_SEO_TEST !== '1') throw new Error('SEO fixture requires explicit test mode')
globalThis.prisma = fixture.prisma
