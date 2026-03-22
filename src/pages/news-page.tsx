import { useEffect, useMemo, useState } from 'react'

import { SEO } from '@/components/seo'
import { NewsCard } from '@/components/news-card'
import { news } from '@/data/news'
import { getPublicNews, toPublicNewsItem } from '@/lib/news-api'
import type { NewsItem } from '@/types/content'

export function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadNews() {
      try {
        const apiNews = await getPublicNews()

        if (!isMounted) {
          return
        }

        const normalized = apiNews.map(toPublicNewsItem)
        const apiSlugs = new Set(normalized.map((n) => n.slug))
        setItems([...normalized, ...news.filter((n) => !apiSlugs.has(n.slug))])
      } catch {
        if (!isMounted) {
          return
        }
        setItems(news)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadNews()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedNews = useMemo(
    () => [...items].sort((a, b) => b.date.localeCompare(a.date)),
    [items],
  )

  return (
    <>
      <SEO
        title="Noticias"
        description="Todas las noticias del Municipio de Cardona en un solo lugar."
      />

      <header className="mb-8">
        <h1 className="font-heading text-3xl text-[--ink-900] md:text-4xl">Noticias</h1>
        <p className="mt-3 max-w-3xl text-[--ink-700]">
          Informacion institucional actualizada sobre obras, cultura, servicios y actividades municipales.
        </p>
      </header>

      {loading ? <p className="mb-5 text-sm text-[--ink-700]">Cargando noticias...</p> : null}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Listado de noticias">
        {sortedNews.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </section>

      {sortedNews.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[--line] bg-white p-8 text-[--ink-700]">
          No hay noticias publicadas por el momento.
        </section>
      ) : null}
    </>
  )
}
