import { FileBadge2, FileText, FolderOpenDot, Gavel, Scale } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { transparencyItems } from '@/data/transparency'
import { formatDate } from '@/lib/utils'
import type { TransparencyType } from '@/types/content'
import type { ComponentType } from 'react'

const iconByType: Record<TransparencyType, ComponentType<{ size?: number }>> = {
  Resolucion: FileText,
  Acta: FileBadge2,
  Presupuesto: Scale,
  Licitacion: Gavel,
  'Documento publico': FolderOpenDot,
}

export function TransparencySection() {
  return (
    <section className="mt-14" aria-labelledby="transparency-title">
      <h2 id="transparency-title" className="font-heading text-2xl text-[--ink-900] md:text-3xl">
        Transparencia
      </h2>
      <p className="mt-2 max-w-3xl text-[--ink-700]">
        Accesos directos a documentos publicos, resoluciones y recursos de gestion.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {transparencyItems.map((item) => {
          const Icon = iconByType[item.type]

          return (
            <Card key={item.id} className="h-full">
              <CardHeader>
                <div className="mb-3 flex items-center justify-between">
                  <span className="grid h-10 w-10 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
                    <Icon size={18} />
                  </span>
                  <Badge variant="muted">{item.type}</Badge>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[--ink-700]">{item.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <a
                    href={item.link}
                    className="text-sm font-semibold text-[--brand-blue] underline-offset-4 hover:underline"
                  >
                    Ver documento
                  </a>
                  {item.date ? (
                    <span className="text-xs text-[--ink-600]">{formatDate(item.date)}</span>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
