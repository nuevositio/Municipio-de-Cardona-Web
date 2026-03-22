import { ClipboardList, FileText, Landmark, UserCheck } from 'lucide-react'

import { PageHero } from '@/components/page-hero'
import { SEO } from '@/components/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const procedures = [
  {
    id: 'proc-1',
    icon: FileText,
    title: 'Permisos de obra',
    description: 'Solicitud, renovacion y seguimiento de permisos para obras particulares.',
  },
  {
    id: 'proc-2',
    icon: UserCheck,
    title: 'Habilitaciones comerciales',
    description: 'Apertura, traslado o actualizacion de habilitaciones para locales.',
  },
  {
    id: 'proc-3',
    icon: Landmark,
    title: 'Exoneraciones y beneficios',
    description: 'Gestiones vinculadas a beneficios fiscales y programas sociales.',
  },
  {
    id: 'proc-4',
    icon: ClipboardList,
    title: 'Solicitudes generales',
    description: 'Canal unico para solicitudes de mantenimiento y atencion de servicios.',
  },
]

export function TramitesPage() {
  return (
    <>
      <SEO
        title="Tramites"
        description="Informacion y accesos a tramites municipales del Municipio de Cardona."
      />
      <PageHero
        title="Tramites municipales"
        description="Inicia tus gestiones de manera clara y ordenada. Este listado organiza los tramites mas frecuentes y sus requisitos principales."
      />

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {procedures.map((procedure) => {
          const Icon = procedure.icon
          return (
            <Card key={procedure.id}>
              <CardHeader>
                <span className="grid h-10 w-10 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
                  <Icon size={18} />
                </span>
                <CardTitle>{procedure.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[--ink-700]">{procedure.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </>
  )
}
