import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { featuredNews } from '@/data/news'
import { useAutoRotate } from '@/hooks/useAutoRotate'
import { formatDate } from '@/lib/utils'

export function HeroSlider() {
  const items = useMemo(() => featuredNews.slice(0, 3), [])
  const [activeIndex, setActiveIndex] = useState(0)

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

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const setFromDot = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  useAutoRotate(next, { enabled: items.length > 1, intervalMs: 7000 })

  const currentItem = items[activeIndex]

  return (
    <section aria-label="Noticias destacadas" className="relative overflow-hidden rounded-3xl border border-[--line] bg-white shadow-sm">
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentItem.id}
            src={currentItem.image}
            alt={currentItem.title}
            className="h-[360px] w-full object-cover lg:h-[440px]"
            initial={{ opacity: 0.35, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        </AnimatePresence>

        <div className="flex flex-col justify-between bg-gradient-to-br from-[--brand-blue] to-[--brand-blue-700] p-6 text-white md:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-white/80">Noticia principal</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentItem.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="mt-3 font-heading text-3xl leading-tight md:text-4xl">{currentItem.title}</h1>
                <p className="mt-4 max-w-xl text-white/90">{currentItem.excerpt}</p>
                <p className="mt-4 text-sm text-white/80">{formatDate(currentItem.date)}</p>
                <Button asChild variant="secondary" className="mt-6">
                  <Link to={`/noticias/${currentItem.slug}`}>Leer mas</Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFromDot(index)}
                  className={
                    index === activeIndex
                      ? 'h-2.5 w-8 rounded-full bg-white'
                      : 'h-2.5 w-2.5 rounded-full bg-white/45'
                  }
                  aria-label={`Ir a noticia ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/15" onClick={prev}>
                <ChevronLeft size={18} />
              </Button>
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/15" onClick={next}>
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
