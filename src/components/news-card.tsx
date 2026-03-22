import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { NewsItem } from '@/types/content'

interface NewsCardProps {
  item: NewsItem
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Card className="h-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-52 w-full object-cover"
          loading="lazy"
        />
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            {item.category}
          </Badge>
          <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
          <p className="line-clamp-3 text-sm text-[--ink-700]">{item.excerpt}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="flex items-center gap-2 text-sm text-[--ink-600]">
            <CalendarDays size={16} />
            {formatDate(item.date)}
          </p>
        </CardContent>
        <CardFooter>
          <Link
            to={`/noticias/${item.slug}`}
            className="text-sm font-semibold text-[--brand-blue] underline-offset-4 hover:underline"
          >
            Leer noticia
          </Link>
        </CardFooter>
      </Card>
    </motion.article>
  )
}
