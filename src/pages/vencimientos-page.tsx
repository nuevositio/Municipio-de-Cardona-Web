import { Calendar } from 'lucide-react'

import { PageHero } from '@/components/page-hero'
import { SEO } from '@/components/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const tributeSchedule = [
  {
    key: 'patente',
    label: 'Patente de Rodados',
    year: '2026',
    cuotas: [
      { num: '1ª Cuota', fecha: 'Martes 20 de enero' },
      { num: '2ª Cuota', fecha: 'Viernes 20 de marzo' },
      { num: '3ª Cuota', fecha: 'Miércoles 20 de mayo' },
      { num: '4ª Cuota', fecha: 'Lunes 20 de julio' },
      { num: '5ª Cuota', fecha: 'Lunes 21 de setiembre' },
      { num: '6ª Cuota', fecha: 'Viernes 20 de noviembre' },
    ],
  },
  {
    key: 'rural',
    label: 'Contribución Inmobiliaria Rural',
    year: '2026',
    cuotas: [
      { num: '1ª Cuota', fecha: 'Viernes 24 de abril' },
      { num: '2ª Cuota', fecha: 'Viernes 15 de mayo' },
      { num: '3ª Cuota', fecha: 'Viernes 26 de junio' },
      { num: '4ª Cuota', fecha: 'Viernes 28 de agosto' },
      { num: '5ª Cuota', fecha: 'Viernes 30 de octubre' },
      { num: '6ª Cuota', fecha: 'Viernes 18 de diciembre' },
    ],
  },
  {
    key: 'urbana',
    label: 'Contribución Inmobiliaria Urbana, Tasas Conexas e Impuesto a los Terrenos Baldíos',
    year: '2026',
    cuotas: [
      { num: '1ª Cuota', fecha: 'Viernes 10 de abril' },
      { num: '2ª Cuota', fecha: 'Viernes 8 de mayo' },
      { num: '3ª Cuota', fecha: 'Miércoles 24 de junio' },
      { num: '4ª Cuota', fecha: 'Miércoles 12 de agosto' },
      { num: '5ª Cuota', fecha: 'Viernes 11 de setiembre' },
      { num: '6ª Cuota', fecha: 'Miércoles 14 de octubre' },
      { num: '7ª Cuota', fecha: 'Viernes 13 de noviembre' },
      { num: '8ª Cuota', fecha: 'Miércoles 23 de diciembre' },
    ],
  },
]

export function VencimientosPage() {
  return (
    <>
      <SEO
        title="Vencimientos de tributos"
        description="Calendario de vencimientos de tributos departamentales: patente de vehículos, contribución inmobiliaria rural y urbana. Año 2026."
      />
      <PageHero
        title="Vencimientos de tributos"
        description="Consultá las fechas de vencimiento de los tributos departamentales para el año 2026: patente de rodados, contribución inmobiliaria rural y contribución inmobiliaria urbana."
      />

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {tributeSchedule.map((tribute) => (
          <Card key={tribute.key}>
            <CardHeader>
              <div className="mb-2 flex items-center gap-3">
                <span className="grid h-10 w-10 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
                  <Calendar size={18} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-[--ink-600]">
                  Año {tribute.year}
                </span>
              </div>
              <CardTitle className="text-base leading-snug">{tribute.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tribute.cuotas.map((cuota) => (
                  <li
                    key={cuota.num}
                    className="flex items-baseline justify-between gap-2 border-b border-[--soft-blue] pb-2 text-sm last:border-0 last:pb-0"
                  >
                    <span className="font-semibold text-[--brand-blue] whitespace-nowrap">
                      {cuota.num}
                    </span>
                    <span className="text-right text-[--ink-700]">{cuota.fecha}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  )
}
