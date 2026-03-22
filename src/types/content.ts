export interface NewsItem {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  category: string
  featured: boolean
}

export interface Authority {
  id: string
  name: string
  role: string
  order: number
}

export type TransparencyType =
  | 'Resolucion'
  | 'Acta'
  | 'Presupuesto'
  | 'Licitacion'
  | 'Documento publico'

export interface TransparencyItem {
  id: string
  title: string
  description: string
  type: TransparencyType
  link: string
  date?: string
}
