import Link from 'next/link'
import ProductDetailClient, { ProductDetailClientProps } from '@/core/components/ProductDetailClient'
import { getProduct } from '@/core/lib/seo-data'
import { notFound } from 'next/navigation'
import { pageMetadata, textDescription, isIndexableProduct, productSchema } from '@/core/lib/seo'
import JsonLd from '@/core/components/JsonLd'
import Breadcrumbs from '@/core/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: ProdutoPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  return pageMetadata({ title: product.name,
    description: textDescription(product.description, product.name),
    path: '/loja/produto/' + encodeURIComponent(product.slug), image: product.images[0]?.url,
    index: isIndexableProduct(product) })
}

type ProdutoPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const { slug } = await params

  const product = await getProduct(slug)
  if (!product) notFound()

  const productForClient: ProductDetailClientProps = {
  id: product.id,
  name: product.name,
  slug: product.slug,
  images: product.images.map((img) => img.url),
  description: product.description,
  price: Number(product.price),

  youtubeUrl: product.youtubeUrl, // ✅ AQUI

  colors: product.colors.map((c) => ({
    id: c.id,
    name: c.name,
    hex: c.hex,
  })),
  sizes: product.sizes.map((s) => ({
    id: s.id,
    name: s.name,
  })),
}

  return (
    <main className="w-full mx-auto p-6">
      <JsonLd data={productSchema(product)} />
      <Breadcrumbs items={[{ name: 'Início', path: '/' }, { name: 'Loja', path: '/loja' },
        ...(product.categories[0] ? [{ name: product.categories[0].name, path: '/loja/categoria/' + encodeURIComponent(product.categories[0].slug) }] : []),
        { name: product.name, path: '/loja/produto/' + encodeURIComponent(product.slug) }]} />
      <Link href="/loja" className="text-purple-700 hover:underline">
        ← Voltar
      </Link>

      <div className="gap-6 mt-4">
        <ProductDetailClient product={productForClient} />
        {product.categories.length > 0 && <nav aria-label="Categorias do produto" className="mt-6 flex flex-wrap gap-4">
          {product.categories.map(category => <Link key={category.id} href={'/loja/categoria/' + encodeURIComponent(category.slug)} className="hover:underline">{category.name}</Link>)}
        </nav>}
      </div>
    </main>
  )
}
