import { useEffect, useMemo, useState } from 'react'

import { NewsCard } from '@/components/news-card'
import { featuredNews } from '@/data/news'
import { getPublicNews, toPublicNewsItem } from '@/lib/news-api'
import type { NewsItem } from '@/types/content'

export function FeaturedNewsSection() {
  const [items, setItems] = useState<NewsItem[]>(featuredNews.slice(0, 4))

  useEffect(() => {
    let isMounted = true

    async function loadFeaturedNews() {
      try {
        const apiNews = await getPublicNews()

        if (!isMounted) {
          return
        }

        const normalized = apiNews.map(toPublicNewsItem)
        const apiSlugs = new Set(normalized.map((n) => n.slug))
        const merged = [...normalized, ...featuredNews.filter((n) => !apiSlugs.has(n.slug))].slice(0, 4)
        setItems(merged)
      } catch {
        if (!isMounted) {
          return
        }
        setItems(featuredNews.slice(0, 4))
      }
    }

    loadFeaturedNews()

    return () => {
      isMounted = false
    }
  }, [])

  const hasItems = useMemo(() => items.length > 0, [items.length])

  return (
    <section className="mt-12" aria-labelledby="featured-news-title">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 id="featured-news-title" className="font-heading text-2xl text-[--ink-900] md:text-3xl">
          Noticias destacadas
        </h2>
      </div>
      {!hasItems ? (
        <div className="rounded-2xl border border-dashed border-[--line] bg-white p-6 text-[--ink-700]">
          Aun no hay noticias destacadas cargadas.
        </div>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
