import { motion } from 'framer-motion'
import { UserRound } from 'lucide-react'

import { authorities } from '@/data/authorities'

export function AuthoritiesSection() {
  const sortedAuthorities = [...authorities].sort((a, b) => a.order - b.order)

  return (
    <section className="mt-14" aria-labelledby="authorities-title">
      <h2 id="authorities-title" className="font-heading text-2xl text-[--ink-900] md:text-3xl">
        Autoridades
      </h2>
      <p className="mt-2 max-w-3xl text-[--ink-700]">
        Equipo de gobierno local comprometido con una gestion transparente y cercana.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {sortedAuthorities.map((authority, index) => (
          <motion.article
            key={authority.id}
            className="rounded-2xl border border-[--line] bg-white p-5 text-center shadow-sm"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          >
            <div
              aria-hidden="true"
              className="mx-auto grid h-28 w-28 place-content-center rounded-full bg-[--soft-blue] text-[--brand-blue] ring-4 ring-[--soft-blue]"
            >
              <UserRound size={42} />
            </div>
            <h3 className="mt-4 font-heading text-xl text-[--ink-900]">{authority.name}</h3>
            <p className="mt-1 text-sm font-medium text-[--brand-blue]">{authority.role}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
