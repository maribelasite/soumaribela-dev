import type { MetadataRoute } from 'next'
import { canonicalUrl, isIndexablePost, isIndexableProduct } from '@/core/lib/seo'
import { reviewedProductSlugs } from '@/client/config/catalog-seo.config'

// Request-time reads reflect publishing/editing/deleting immediately, without admin mutations.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { prisma } = await import('@/core/lib/prisma')
  const [pages, posts, blogCategories, products, categories] = await Promise.all([
    prisma.customPage.findMany({ where: { slug: { in: ['sobre', 'personalizado'] } },
      select: { slug: true, title: true, introText: true, updatedAt: true } }),
    prisma.post.findMany({ where: { published: true },
      select: { slug: true, title: true, content: true, published: true, updatedAt: true } }),
    prisma.blogCategory.findMany({ include: { posts: { where: { published: true },
      select: { title: true, content: true, published: true } } } }),
    prisma.product.findMany({ where: { slug: { in: [...reviewedProductSlugs] } }, include: { images: true } }),
    prisma.category.findMany({ where: { slug: { not: 'todos' } },
      include: { products: { where: { slug: { in: [...reviewedProductSlugs] } }, include: { images: true } } } }),
  ])
  const entries: MetadataRoute.Sitemap = ['/', '/loja', '/blog'].map(path => ({ url: canonicalUrl(path) }))
  for (const page of pages) if (page.title.trim() && page.introText?.trim())
    entries.push({ url: canonicalUrl(`/${page.slug}`), lastModified: page.updatedAt })
  for (const post of posts) if (isIndexablePost(post))
    entries.push({ url: canonicalUrl(`/blog/${encodeURIComponent(post.slug)}`), lastModified: post.updatedAt })
  for (const category of blogCategories) if (category.name.trim() && category.posts.some(isIndexablePost))
    entries.push({ url: canonicalUrl(`/blog/categoria/${encodeURIComponent(category.slug)}`), lastModified: category.updatedAt })
  for (const product of products) if (isIndexableProduct(product))
    entries.push({ url: canonicalUrl(`/loja/produto/${encodeURIComponent(product.slug)}`), lastModified: product.updatedAt })
  for (const category of categories) if (category.name.trim() && category.products.some(product => isIndexableProduct(product)))
    entries.push({ url: canonicalUrl(`/loja/categoria/${encodeURIComponent(category.slug)}`) })
  return [...new Map(entries.map(entry => [entry.url, entry])).values()]
}
