import { cache } from 'react'
import { pageMetadata, isIndexableProduct } from '@/core/lib/seo'
import Breadcrumbs from '@/core/components/Breadcrumbs'

export const dynamic = 'force-dynamic'
// app/loja/categoria/[slug]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/core/lib/prisma'
import { Prisma } from '@/generated/client'

interface CategoriaPageProps {
  params: Promise<{ slug: string }>
}

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    colors: true
    sizes: true
    images: true
  }
}>

const getProdutosByCategoriaSlug = cache(async function getProdutosByCategoriaSlug(
  slug: string
): Promise<{ produtos: ProductWithRelations[]; categoriaNome: string }> {
  if (slug === 'todos') {
    const produtos = await prisma.product.findMany({
      include: {
        colors: true,
        sizes: true,
        images: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      produtos,
      categoriaNome: 'Todos os Produtos',
    }
  }

  const categoria = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          colors: true,
          sizes: true,
          images: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!categoria) {
    return { produtos: [], categoriaNome: '' }
  }

  return {
    produtos: categoria.products,
    categoriaNome: categoria.name,
  }
})

export async function generateMetadata({ params }: CategoriaPageProps) {
  const { slug } = await params
  const { produtos, categoriaNome } = await getProdutosByCategoriaSlug(slug)
  if (!categoriaNome) notFound()
  return pageMetadata({ title: slug === 'todos' ? 'Loja de crochê artesanal' : categoriaNome,
    description: slug === 'todos' ? 'Conheça a coleção de peças artesanais em crochê da Maribela Art & Crochê.' : 'Conheça ' + categoriaNome + ' na coleção de crochê artesanal da Maribela.',
    path: slug === 'todos' ? '/loja' : '/loja/categoria/' + encodeURIComponent(slug),
    index: slug === 'todos' || produtos.some(product => isIndexableProduct(product)) })
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const { slug } = await params

  const { produtos, categoriaNome } = await getProdutosByCategoriaSlug(slug)

  if (!categoriaNome) return notFound()

  return (
    <main>
      <div className="px-4 md:px-20 pt-4"><Breadcrumbs items={[{ name: 'Início', path: '/' }, { name: 'Loja', path: '/loja' },
        ...(slug === 'todos' ? [] : [{ name: categoriaNome, path: '/loja/categoria/' + encodeURIComponent(slug) }])]} /></div>
      <section className="px-4 py-6 md:px-20 md:py-20">
        <header className="max-w-6xl mx-auto mb-8 md:mb-10">
          <h1
            className="text-2xl md:text-4xl leading-tight mb-2"
            style={{
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-logo)',
            }}
          >
            {categoriaNome}
          </h1>
        </header>

        {produtos.length === 0 ? (
          <div className="max-w-6xl mx-auto">
            <p
              className="text-sm md:text-base"
              style={{
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Nenhum produto encontrado nesta categoria.
            </p>

            <Link
              href="/loja"
              className="inline-flex mt-4 px-5 py-3 rounded-full text-xs md:text-sm uppercase tracking-[0.18em] transition"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Ver todos os produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {produtos.map((product) => {
              const image = product.images?.[0]?.url || '/logo-maribela-horizontal.png'

              return (
                <Link
                  key={product.id}
                  href={`/loja/produto/${product.slug}`}
                  className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition flex flex-col"
                >
                  <div className="w-full aspect-square md:aspect-auto md:h-72 relative">
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-2 md:p-4 flex flex-col flex-1">
                    <h2
                      className="text-sm md:text-xl font-semibold line-clamp-2"
                      style={{ color: 'var(--color-textPrimary)' }}
                    >
                      {product.name}
                    </h2>

                    <p className="text-green-700 font-bold text-sm md:text-lg mt-1">
                      R$ {Number(product.price).toFixed(2)}
                    </p>

                    <button className="bg-green-600 w-full mt-auto py-1 md:py-2 rounded-lg text-xs md:text-sm font-bold text-white md:mt-3">
                      VER DETALHES
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}