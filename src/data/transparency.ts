import type { TransparencyItem } from '@/types/content'

export const transparencyItems: TransparencyItem[] = [
  {
    id: 'tr-1',
    title: 'Resoluciones de Gobierno Local',
    description: 'Resoluciones oficiales emitidas por el Municipio durante 2026.',
    type: 'Resolucion',
    link: '#',
    date: '2026-03-20',
  },
  {
    id: 'tr-2',
    title: 'Actas de Sesiones del Concejo',
    description: 'Actas aprobadas de sesiones ordinarias y extraordinarias.',
    type: 'Acta',
    link: '#',
    date: '2026-03-12',
  },
  {
    id: 'tr-3',
    title: 'Presupuesto y Ejecucion',
    description: 'Detalle del presupuesto anual y estado de ejecucion trimestral.',
    type: 'Presupuesto',
    link: '#',
  },
  {
    id: 'tr-4',
    title: 'Licitaciones Abiertas',
    description: 'Llamados vigentes con pliegos, fechas y requisitos.',
    type: 'Licitacion',
    link: '#',
    date: '2026-03-08',
  },
  {
    id: 'tr-5',
    title: 'Documentos Publicos',
    description: 'Normativas, informes tecnicos y documentos de interes general.',
    type: 'Documento publico',
    link: '#',
  },
]
