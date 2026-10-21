import Link from 'next/link'
import JsonLd from '@/core/components/JsonLd'
import { breadcrumbSchema } from '@/core/lib/seo'

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return <>
    <JsonLd data={breadcrumbSchema(items)} />
    <nav aria-label="Navegação estrutural" className="mb-4 text-sm">
      <ol className="flex flex-wrap gap-2">
        {items.map((item, index) => <li key={item.path}>
          {index > 0 && <span aria-hidden="true" className="mr-2">/</span>}
          {index === items.length - 1 ? <span aria-current="page">{item.name}</span> :
            <Link href={item.path} className="hover:underline">{item.name}</Link>}
        </li>)}
      </ol>
    </nav>
  </>
}
