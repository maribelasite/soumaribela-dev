import type { Metadata } from 'next'
import { siteConfig } from '@/client/config/site.config'
import { reviewedProductSlugs } from '@/client/config/catalog-seo.config'

export const SITE_URL = 'https://www.maribela.com.br'
export const BRAND = 'Maribela Art & Crochê'
export const NO_INDEX: Metadata['robots'] = { index: false, follow: true }

export function canonicalUrl(path: string) {
  const url = new URL(path, SITE_URL)
  if (url.origin !== SITE_URL) throw new Error('Canonical must use the official domain')
  url.search = ''
  url.hash = ''
  return url.toString()
}

export function textDescription(text: string | null | undefined, fallback: string) {
  const plain = (text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return plain ? plain.slice(0, 160) : fallback
}

export function publicImageUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value, SITE_URL)
    if (url.protocol !== 'https:' || url.username || url.password) return undefined
    return url.toString()
  } catch { return undefined }
}

export function pageMetadata({ title, description, path, image, index = true, article = false }:
  { title: string; description: string; path: string; image?: string | null; index?: boolean; article?: boolean }): Metadata {
  const fullTitle = title.includes('Maribela') ? title : `${title} | ${BRAND}`
  const url = canonicalUrl(path)
  const imageUrl = publicImageUrl(image) || canonicalUrl(siteConfig.seo.ogImage)
  return {
    title: { absolute: fullTitle }, description,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : NO_INDEX,
    openGraph: { title: fullTitle, description, url, siteName: BRAND, locale: 'pt_BR',
      type: article ? 'article' : 'website', images: [{ url: imageUrl, alt: title }] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [imageUrl] },
  }
}

export type SeoProduct = {
  slug: string; name: string; description: string; price: { toString(): string } | number | string;
  stock: number; images: { url: string }[]
}

export function isIndexableProduct(product: SeoProduct, reviewed = reviewedProductSlugs) {
  return reviewed.includes(product.slug) && product.name.trim().length > 0 &&
    product.description.trim().length > 0 && Number.isFinite(Number(product.price)) &&
    Number(product.price) > 0 && Number.isInteger(product.stock) && product.stock > 0 &&
    product.images.some(image => Boolean(publicImageUrl(image.url)))
}

export function isIndexablePost(post: { title: string; content: string; published: boolean }) {
  return post.published && Boolean(post.title.trim()) && Boolean(post.content.trim())
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1,
      name: item.name, item: canonicalUrl(item.path) })) }
}

export function productSchema(product: SeoProduct, reviewed = reviewedProductSlugs) {
  if (!isIndexableProduct(product, reviewed)) return null
  const url = canonicalUrl(`/loja/produto/${encodeURIComponent(product.slug)}`)
  return { '@context': 'https://schema.org', '@type': 'Product', '@id': `${url}#product`,
    name: product.name, description: product.description,
    image: product.images.map(image => publicImageUrl(image.url)).filter(Boolean), url,
    offers: { '@type': 'Offer', url, priceCurrency: 'BRL', price: Number(product.price).toFixed(2),
      availability: 'https://schema.org/InStock' } }
}

export function organizationSchema() {
  return { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE_URL}/#organization`,
    name: BRAND, url: SITE_URL, logo: canonicalUrl(siteConfig.logoHorizontal),
    sameAs: [`https://www.instagram.com/${siteConfig.instagram.replace('@', '')}/`] }
}

export function websiteSchema() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`,
    name: BRAND, url: SITE_URL, inLanguage: 'pt-BR', publisher: { '@id': `${SITE_URL}/#organization` } }
}

export function blogPostingSchema(post: { title: string; slug: string; content: string; published: boolean;
  excerpt: string | null; coverImage: string | null; updatedAt: Date }) {
  if (!isIndexablePost(post)) return null
  const url = canonicalUrl(`/blog/${encodeURIComponent(post.slug)}`)
  return { '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`,
    headline: post.title, description: textDescription(post.excerpt || post.content, post.title),
    mainEntityOfPage: url, url, inLanguage: 'pt-BR', dateModified: post.updatedAt.toISOString(),
    ...(publicImageUrl(post.coverImage) ? { image: publicImageUrl(post.coverImage) } : {}),
    publisher: { '@id': `${SITE_URL}/#organization` } }
}
