// ── Interfaces ────────────────────────────────────────────────────────────────
import { API_BASE } from './api-base.js'

/** Forma que devuelve el servidor para el sitio público. */
export interface ApiResolution {
  id:          string
  title:       string
  slug:        string
  summary:     string | null
  fileUrl:     string | null
  publishedAt: string | null
  createdAt:   string
  updatedAt:   string
}

// ── Peticiones públicas ───────────────────────────────────────────────────────

/** Construye la URL completa del archivo PDF. */
export function getResolutionFileUrl(fileUrl: string | null | undefined): string {
  if (!fileUrl) return ''
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl
  return `${API_BASE}${fileUrl}`
}

/** Devuelve las resoluciones publicadas. */
export async function getPublicResolutions(): Promise<ApiResolution[]> {
  const res = await fetch(`${API_BASE}/api/resolutions?limit=50`)
  if (!res.ok) throw new Error('No se pudieron cargar las resoluciones.')
  return (await res.json()) as ApiResolution[]
}
