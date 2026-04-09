import { apiFetch } from './fetch.js'
import type { NewsItem } from '../types/index.js'
import { API_BASE } from '../../lib/api-base.js'

const BASE = `${API_BASE}/api/admin/news`

export interface NewsListResponse {
  total: number; limit: number; offset: number; items: NewsItem[]
}
export interface NewsResponse { item: NewsItem }

export const apiGetNews = (limit = 50, offset = 0) =>
  apiFetch<NewsListResponse>(`${BASE}?limit=${limit}&offset=${offset}`)

export const apiGetNewsItem = (id: string) =>
  apiFetch<NewsResponse>(`${BASE}/${id}`)

export interface CreateNewsPayload {
  title: string; excerpt: string; content: string
  slug?: string; imageUrl?: string; publishedAt?: string | null
}

export const apiCreateNews = (payload: CreateNewsPayload) =>
  apiFetch<NewsResponse>(BASE, { method: 'POST', body: JSON.stringify(payload) })

export type UpdateNewsPayload = Partial<CreateNewsPayload>

export const apiUpdateNews = (id: string, payload: UpdateNewsPayload) =>
  apiFetch<NewsResponse>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })

export const apiDeleteNews = (id: string) =>
  apiFetch<{ message: string }>(`${BASE}/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ confirm: true }),
  })
