import { getCustomPage } from "@/core/lib/seo-data"
import { pageMetadata, textDescription } from "@/core/lib/seo"
import { notFound } from "next/navigation"

type FAQItem = {
  pergunta: string
  resposta: string
}

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const page = await getCustomPage('personalizado')
  if (!page) notFound()
  return pageMetadata({ title: page.title || 'Peças personalizadas em crochê',
    description: textDescription(page.introText, 'Conheça as opções de encomendas de peças personalizadas em crochê da Maribela.'),
    path: '/personalizado', image: page.coverImage, index: Boolean(page.title.trim() && page.introText?.trim()) })
}

export default async function PersonalizadosPage() {
  const page = await getCustomPage('personalizado')
  if (!page) return notFound()

  const faqs = (page.faq as FAQItem[]) || []

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] min-h-screen">

      <h1 className="text-3xl font-bold">{page.title}</h1>

      {/* Intro */}
      <p className="text-[var(--color-text-secondary)]">{page.introText}</p>

      {/* FAQ */}
      <div className="space-y-4">
        {faqs.map((item, i: number) => (
          <div key={i} className="border border-[var(--color-border)] rounded-2xl p-4 bg-[var(--color-bg-card)]">
            <h2 className="font-semibold">{item.pergunta}</h2>
            <p className="text-[var(--color-text-secondary)] mt-2">{item.resposta}</p>
          </div>
        ))}
      </div>


    </div>
  )
}
