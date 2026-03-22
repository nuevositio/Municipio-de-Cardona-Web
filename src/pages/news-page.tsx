import { SEO } from '@/components/seo'
import { NewsCard } from '@/components/news-card'
import { news } from '@/data/news'

export function NewsPage() {
  const sortedNews = [...news].sort((a, b) => b.date.localeCompare(a.date))

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
