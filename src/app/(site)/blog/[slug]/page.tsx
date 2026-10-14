import { getPublishedPost } from '@/core/lib/seo-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { pageMetadata, textDescription, isIndexablePost, blogPostingSchema } from '@/core/lib/seo'
import JsonLd from '@/core/components/JsonLd'
import Breadcrumbs from '@/core/components/Breadcrumbs'

export const dynamic = 'force-dynamic'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) notFound()
  return pageMetadata({ title: post.seo?.metaTitle?.trim() || post.title,
    description: textDescription(post.seo?.metaDesc?.trim() || post.excerpt?.trim() || post.content, post.title),
    path: '/blog/' + encodeURIComponent(post.slug), image: post.coverImage,
    article: true, index: isIndexablePost(post) })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <article className="max-w-4xl mx-auto px-4 py-8">
        <JsonLd data={blogPostingSchema(post)} />
        <Breadcrumbs items={[{ name: 'Início', path: '/' }, { name: 'Blog', path: '/blog' },
          ...(post.category ? [{ name: post.category.name, path: '/blog/categoria/' + encodeURIComponent(post.category.slug) }] : []),
          { name: post.title, path: '/blog/' + encodeURIComponent(post.slug) }]} />
        {post.coverImage && (
          <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-[var(--color-text-secondary)]">
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </header>

<div className="prose prose-lg prose-invert max-w-none whitespace-pre-line">
  {post.content}
</div>
      </article>
    </div>
  )
}
