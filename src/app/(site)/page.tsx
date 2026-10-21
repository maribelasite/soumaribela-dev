import { pageMetadata } from '@/core/lib/seo'
import { siteConfig } from '@/client/config/site.config'
// src/app/(site)/page.tsx
import HomePage from '@/client/home/HomePage'

export const dynamic = 'force-dynamic'
export const metadata = pageMetadata({ title: siteConfig.seo.titulo, description: siteConfig.seo.descricao, path: '/' })

export default function Page() {
  return <HomePage />
}