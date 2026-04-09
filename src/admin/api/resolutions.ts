import { apiFetch } from './fetch.js'
import type { ResolutionItem } from '../types/index.js'
import { API_BASE } from '../../lib/api-base.js'

const BASE = `${API_BASE}/api/admin/resolutions`

export interface ResolutionsListResponse {
  total: number; limit: number; offset: number; items: ResolutionItem[]
}
export interface ResolutionResponse { item: ResolutionItem }

export const apiGetResolutions = (limit = 50, offset = 0) =>
  apiFetch<ResolutionsListResponse>(`${BASE}?limit=${limit}&offset=${offset}`)

export interface CreateResolutionPayload {
  title: string; fileUrl: string
  slug?: string; summary?: string; publishedAt?: string | null
}

export const apiCreateResolution = (payload: CreateResolutionPayload) =>
  apiFetch<ResolutionResponse>(BASE, { method: 'POST', body: JSON.stringify(payload) })

export type UpdateResolutionPayload = Partial<CreateResolutionPayload>

export const apiUpdateResolution = (id: string, payload: UpdateResolutionPayload) =>
  apiFetch<ResolutionResponse>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })

export const apiDeleteResolution = (id: string) =>
  apiFetch<{ message: string }>(`${BASE}/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ confirm: true }),
  })
