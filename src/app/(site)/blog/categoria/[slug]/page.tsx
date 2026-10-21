import { getBlogCategory } from '@/core/lib/seo-data'
import { notFound } from 'next/navigation'
import { pageMetadata, textDescription, isIndexablePost } from '@/core/lib/seo'
import Breadcrumbs from '@/core/components/Breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const category = await getBlogCategory(slug)
  if (!category) notFound()
  return pageMetadata({ title: category.name + ' — Blog',
    description: textDescription(category.description, 'Artigos da Maribela sobre ' + category.name + '.'),
    path: '/blog/categoria/' + encodeURIComponent(category.slug), image: category.image,
    index: Boolean(category.name.trim()) && category.posts.some(isIndexablePost) })
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params

  const category = await getBlogCategory(slug)
  if (!category) notFound()

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      <Breadcrumbs items={[{ name: 'Início', path: '/' }, { name: 'Blog', path: '/blog' },
        { name: category.name, path: '/blog/categoria/' + encodeURIComponent(category.slug) }]} />

      {/* HEADER */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold">
          {category.name}
        </h1>

        {category.description && (
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {/* POSTS */}
      {category.posts.length === 0 ? (
        <div className="text-center text-[var(--color-text-tertiary)]">
          Nenhum conteúdo ainda.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {category.posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-3xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-card)] hover:shadow-md transition"
            >

              {post.coverImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold group-hover:text-[var(--color-accent)] transition">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </div>

            </Link>
          ))}

        </div>
      )}

    </main>
  )
}
