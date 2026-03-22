import { motion } from 'framer-motion'

interface PageHeroProps {
  title: string
  description: string
}

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <motion.header
      className="rounded-3xl border border-[--line] bg-gradient-to-r from-[#dcecf8] via-[#eef6fc] to-[#def1e6] p-8 md:p-10 shadow-sm"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <h1 className="font-heading text-3xl text-[--ink-900] md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-[--ink-700]">{description}</p>
    </motion.header>
  )
}
