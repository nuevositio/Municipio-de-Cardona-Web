import { NewsCard } from '@/components/news-card'
import { featuredNews } from '@/data/news'

export function FeaturedNewsSection() {
  const items = featuredNews.slice(0, 4)

  return (
    <section className="mt-12" aria-labelledby="featured-news-title">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 id="featured-news-title" className="font-heading text-2xl text-[--ink-900] md:text-3xl">
          Noticias destacadas
        </h2>
      </div>
      {items.length === 0 ? (
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
