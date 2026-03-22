import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { SEO } from '@/components/seo'
import { news } from '@/data/news'
import { formatDate } from '@/lib/utils'

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const item = news.find((entry) => entry.slug === slug)

  if (!item) {
    return <Navigate to="/404" replace />
  }

  const paragraphs = item.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <article className="mx-auto max-w-4xl">
      <SEO title={item.title} description={item.excerpt} />

      <Link
        to="/noticias"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[--brand-blue] hover:underline"
      >
        <ArrowLeft size={16} />
        Volver a noticias
      </Link>

      <img
        src={item.image}
        alt={item.title}
        className="h-[340px] w-full rounded-3xl object-cover md:h-[460px]"
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge>{item.category}</Badge>
        <p className="text-sm text-[--ink-600]">{formatDate(item.date)}</p>
      </div>

      <h1 className="mt-4 font-heading text-3xl text-[--ink-900] md:text-4xl">{item.title}</h1>
      <div className="mt-5 space-y-5 text-left text-lg leading-relaxed text-[--ink-700]">
        {paragraphs.map((paragraph, index) => (
          <p key={`${item.id}-paragraph-${index}`}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
