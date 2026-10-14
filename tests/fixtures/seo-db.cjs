// In-memory fixtures only. No connection, credentials, writes or external requests.
const updatedAt = new Date('2026-10-01T12:00:00Z')
const post = { id: 'fixture-post', slug: 'fixture-article', title: 'Artigo de teste em memória',
  content: 'Conteúdo de teste em memória.', excerpt: 'Resumo de teste.', published: true,
  coverImage: '/hero-maribela.jpg', createdAt: updatedAt, updatedAt,
  seo: { metaTitle: 'Título editorial de teste', metaDesc: 'Descrição editorial de teste' },
  category: { name: 'Categoria editorial de teste', slug: 'fixture-blog-category' } }
const product = { id: 'fixture-product', slug: 'fixture-product', name: 'Produto de teste em memória',
  description: 'Descrição de teste em memória.', price: 10, stock: 2,
  createdAt: updatedAt, updatedAt, colors: [], sizes: [], youtubeUrl: null,
  categories: [{ id: 'fixture-category', name: 'Categoria de teste', slug: 'fixture-category' }],
  images: [{ id: 'fixture-image', url: '/hero-maribela.jpg', createdAt: updatedAt }] }
const state = {
  products: [product], posts: [post, { ...post, id: 'draft', slug: 'draft', published: false }],
  pages: ['sobre', 'personalizado'].map(slug => ({ id: slug, slug, title: `Página ${slug} de teste`,
    introText: 'Texto institucional de teste.', updatedAt, coverImage: null, faq: [],
    section1Title: 'Seção', section1Text: 'Texto' })),
  categories: [{ id: 'fixture-category', name: 'Categoria de teste', slug: 'fixture-category', products: [product] },
    { id: 'empty-category', name: 'Categoria vazia', slug: 'empty-category', products: [] }],
  blogCategories: [{ id: 'fixture-blog-category', name: 'Categoria editorial de teste', slug: 'fixture-blog-category',
    description: 'Descrição da categoria.', image: null, updatedAt, showOnHome: true, order: 0, posts: [post] },
    { id: 'empty-blog-category', name: 'Categoria editorial vazia', slug: 'empty-blog-category', updatedAt,
      image: null, description: null, showOnHome: false, posts: [] }],
}
const prisma = {
  product: {
    findUnique: async ({ where }) => state.products.find(p => p.slug === where.slug) || null,
    findMany: async ({ where } = {}) => state.products.filter(p => !where?.slug?.in || where.slug.in.includes(p.slug)),
  },
  post: {
    findFirst: async ({ where }) => state.posts.find(p => p.slug === where.slug && p.published === where.published) || null,
    findMany: async ({ where } = {}) => state.posts.filter(p => where?.published === undefined || p.published === where.published),
  },
  customPage: {
    findUnique: async ({ where }) => state.pages.find(p => p.slug === where.slug) || null,
    findMany: async ({ where } = {}) => state.pages.filter(p => !where?.slug?.in || where.slug.in.includes(p.slug)),
  },
  category: {
    findUnique: async ({ where }) => state.categories.find(p => p.slug === where.slug) || null,
    findMany: async ({ where } = {}) => state.categories.filter(p => p.slug !== where?.slug?.not),
  },
  blogCategory: {
    findUnique: async ({ where }) => state.blogCategories.find(p => p.slug === where.slug) || null,
    findMany: async ({ where } = {}) => state.blogCategories.filter(p => !where?.showOnHome || p.showOnHome),
  },
  adminUser: { findUnique: async () => { throw new Error('Administrative data unavailable in SEO fixture') } },
  order: { findUnique: async () => null },
}
module.exports = { state, prisma, product, post }
