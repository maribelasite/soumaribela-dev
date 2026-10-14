import { serializeJsonLd } from '@/core/lib/seo'

export default function JsonLd({ data }: { data: unknown }) {
  if (!data) return null
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}
