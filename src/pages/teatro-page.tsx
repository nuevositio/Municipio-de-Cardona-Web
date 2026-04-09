import { Clapperboard, Ticket, Users } from 'lucide-react'

import { PageHero } from '@/components/page-hero'
import { SEO } from '@/components/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const theatreItems = [
  {
    id: 'tea-1',
    icon: Clapperboard,
    title: 'Temporada teatral 2026',
    description: 'Obras regionales y nacionales con funciones semanales en el Teatro Municipal.',
  },
  {
    id: 'tea-2',
    icon: Ticket,
    title: 'Entradas y reservas',
    description: 'Sistema presencial de reservas con cupos para estudiantes y adultos mayores.',
  },
  {
    id: 'tea-3',
    icon: Users,
    title: 'Elenco y comunidad',
    description: 'Programas de formacion escenica y actividades abiertas para la comunidad.',
  },
]

export function TeatroPage() {
  return (
    <>
      <SEO
        title="Teatro"
        description="Cartelera, actividades y acciones culturales del Teatro Municipal."
      />
      <PageHero
        title="Teatro"
        description="El Teatro Municipal promueve la produccion artistica local y el acceso ciudadano a propuestas escenicas de calidad."
      />

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {theatreItems.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.id}>
              <CardHeader>
                <span className="grid h-10 w-10 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
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
