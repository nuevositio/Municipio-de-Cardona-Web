import type { NewsItem } from '@/types/content'
import { API_BASE } from './api-base.js'

// ── Interfaces ────────────────────────────────────────────────────────────────

/** Forma que devuelve el servidor para el sitio público. */
export interface ApiNewsItem {
  id:          string
  title:       string
  slug:        string
  excerpt:     string | null
  content:     string | null
  imageUrl:    string | null
  publishedAt: string | null
  createdAt:   string
  updatedAt:   string
}

export interface ApiNewsListResponse {
  total:  number
  limit:  number
  offset: number
  items:  ApiNewsItem[]
}

// ── Peticiones públicas ───────────────────────────────────────────────────────

/** Devuelve las noticias publicadas del sitio público. */
export async function getPublicNews(): Promise<ApiNewsItem[]> {
  const res = await fetch(`${API_BASE}/api/news?limit=50`)
  if (!res.ok) throw new Error('No se pudieron cargar las noticias.')
  const data = (await res.json()) as ApiNewsListResponse
  return data.items
}

/** Devuelve una noticia pública por slug. */
export async function getPublicNewsBySlug(slug: string): Promise<ApiNewsItem> {
  const res = await fetch(`${API_BASE}/api/news/${encodeURIComponent(slug)}`)
  if (!res.ok) throw new Error('Noticia no encontrada.')
  return (await res.json()) as ApiNewsItem
}

// ── Adaptador público → tipo interno del sitio ────────────────────────────────

/** Convierte una `ApiNewsItem` en el tipo `NewsItem` usado por los componentes. */
export function toPublicNewsItem(item: ApiNewsItem): NewsItem {
  return {
    id:       item.id,
    slug:     item.slug,
    title:    item.title,
    excerpt:  item.excerpt ?? '',
    content:  item.content ?? '',
    image:    item.imageUrl ?? '',
    date:     item.publishedAt ?? item.createdAt,
    category: 'Institucional',
    featured: false,
  }
}

