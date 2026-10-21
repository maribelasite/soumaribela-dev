import type { MetadataRoute } from 'next'
import { canonicalUrl, SITE_URL } from '@/core/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: canonicalUrl('/sitemap.xml'), host: SITE_URL }
  // Admin/operational pages remain crawlable so their noindex directives can be read.
}
