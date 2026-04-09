import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { news } from '@/data/news'
import { useAutoRotate } from '@/hooks/useAutoRotate'
import { getPublicNews, toPublicNewsItem } from '@/lib/news-api'
import { formatDate } from '@/lib/utils'
import type { NewsItem } from '@/types/content'

function buildSliderItems(apiItems: NewsItem[]) {
  const apiSlugs = new Set(apiItems.map((n) => n.slug))
  const merged = [...apiItems, ...news.filter((n) => !apiSlugs.has(n.slug))]
  return merged
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
}

export function HeroSlider() {
  const [items, setItems] = useState<NewsItem[]>(
    () => [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
  )
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let isMounted = true
    getPublicNews()
      .then((apiNews) => {
        if (!isMounted) return
        setItems(buildSliderItems(apiNews.map(toPublicNewsItem)))
      })
      .catch(() => { /* mantiene datos estáticos */ })
    return () => { isMounted = false }
  }, [])

  // ── Todos los hooks deben declararse antes de cualquier return condicional ──
  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const setFromDot = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  useAutoRotate(next, { enabled: items.length > 1, intervalMs: 5000 })

  if (items.length === 0) {
    return (
      <section
        aria-label="Noticias destacadas"
        className="relative overflow-hidden rounded-3xl border border-[--line] bg-white shadow-sm"
      >
        <div className="grid min-h-[320px] place-content-center bg-gradient-to-br from-[--brand-blue] to-[--brand-blue-700] p-8 text-center text-white md:min-h-[420px]">
          <p className="text-sm uppercase tracking-[0.12em] text-white/75">Noticias destacadas</p>
          <h1 className="mt-3 font-heading text-3xl md:text-4xl">Sin noticias publicadas</h1>
          <p className="mt-4 max-w-xl text-white/85">
            Cuando agregues noticias marcadas como destacadas, apareceran automaticamente en este espacio.
          </p>
        </div>
      </section>
    )
  }

  const currentItem = items[activeIndex]
  const leadParagraph = currentItem.content.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)[0] ?? currentItem.excerpt

  return (
    <section
      aria-label="Noticias destacadas"
      className="relative overflow-hidden rounded-3xl border border-[--line] bg-white shadow-2xl shadow-slate-900/20"
    >
      <div className="relative min-h-[380px] md:min-h-[460px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentItem.id}
            src={currentItem.image}
            alt={currentItem.title}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0.35, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-[#2e2e2e]/90 via-[#2e2e2e]/68 to-black/38" />

        <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentItem.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="max-w-3xl"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-white/80 md:text-sm">Noticias del Municipio</p>
              <h1 className="mt-3 font-heading text-2xl leading-tight text-white md:text-4xl">{currentItem.title}</h1>
              <p className="mt-4 line-clamp-3 max-w-2xl text-sm text-white/90 md:text-base">{leadParagraph}</p>
              <p className="mt-4 text-xs text-white/75 md:text-sm">{formatDate(currentItem.date)}</p>
              <Button
                asChild
                className="mt-6 border-0 bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-700)]"
              >
                <Link to={`/noticias/${currentItem.slug}`}>Leer noticia completa</Link>
              </Button>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFromDot(index)}
                  className={
                    index === activeIndex
                      ? 'h-2.5 w-8 rounded-full bg-white shadow-sm shadow-black/30'
                      : 'h-2.5 w-2.5 rounded-full bg-white/45'
                  }
                  aria-label={`Ir a noticia ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="bg-black/20 text-white hover:bg-black/35" onClick={prev}>
                <ChevronLeft size={18} />
              </Button>
              <Button size="icon" variant="ghost" className="bg-black/20 text-white hover:bg-black/35" onClick={next}>
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
