import { CalendarHeart, Landmark, Music2 } from 'lucide-react'

import { PageHero } from '@/components/page-hero'
import { SEO } from '@/components/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const cultureHighlights = [
  {
    id: 'cul-1',
    icon: CalendarHeart,
    title: 'Agenda cultural',
    description: 'Programacion mensual de actividades para vecinas y vecinos de todas las edades.',
  },
  {
    id: 'cul-2',
    icon: Music2,
    title: 'Talleres y formacion',
    description: 'Espacios de aprendizaje en musica, artes visuales, danza y expresion escenica.',
  },
  {
    id: 'cul-3',
    icon: Landmark,
    title: 'Patrimonio local',
    description: 'Acciones de puesta en valor de la historia y memoria colectiva de la comunidad.',
  },
]

export function CulturaPage() {
  return (
    <>
      <SEO
        title="Cultura"
        description="Propuestas culturales, actividades y programas comunitarios del Municipio."
      />
      <PageHero
        title="Cultura"
        description="Impulsamos una agenda cultural viva, diversa y accesible, con fuerte presencia de artistas y colectivos locales."
      />

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {cultureHighlights.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.id}>
              <CardHeader>
                <span className="grid h-10 w-10 place-content-center rounded-xl bg-[--soft-green] text-[--brand-green]">
                  <Icon size={18} />
                </span>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[--ink-700]">{item.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </>
  )
}
