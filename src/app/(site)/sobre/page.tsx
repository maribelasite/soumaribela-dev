import { getCustomPage } from "@/core/lib/seo-data"
import { pageMetadata, textDescription } from "@/core/lib/seo"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const page = await getCustomPage('sobre')
  if (!page) notFound()
  return pageMetadata({ title: page.title || 'Sobre a Maribela',
    description: textDescription(page.introText, 'Conheça a Maribela Art & Crochê e sua proposta de peças artesanais em crochê.'),
    path: '/sobre', image: page.coverImage, index: Boolean(page.title.trim() && page.introText?.trim()) })
}

export default async function SobrePage() {
  const page = await getCustomPage('sobre')
  if (!page) return notFound()

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] min-h-screen">

      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold">{page.title}</h1>
        <p className="whitespace-pre-line text-[var(--color-text-secondary)] mt-2">{page.introText}</p>
      </div>

      {/* Imagens */}
      <div className="grid md:grid-cols-2 gap-6">
        {page.coverImage && (
          <img src={page.coverImage} alt={page.title} className="rounded-2xl" />
        )}
      </div>

      {/* Seção */}
      <div>
        <h2 className="text-xl font-semibold">
          💛 {page.section1Title}
        </h2>
        <p className="whitespace-pre-line text-[var(--color-text-secondary)] mt-2">
          {page.section1Text}
        </p>
      </div>


    </div>
  ) 
}