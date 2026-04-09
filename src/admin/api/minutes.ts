import { apiFetch } from './fetch.js'
import type { MinuteItem } from '../types/index.js'
import { API_BASE } from '../../lib/api-base.js'

const BASE = `${API_BASE}/api/admin/minutes`

export interface MinutesListResponse {
  total: number; limit: number; offset: number; items: MinuteItem[]
}
export interface MinuteResponse { item: MinuteItem }

export const apiGetMinutes = (limit = 50, offset = 0) =>
  apiFetch<MinutesListResponse>(`${BASE}?limit=${limit}&offset=${offset}`)

export interface CreateMinutePayload {
  title: string; fileUrl: string
  slug?: string; summary?: string; publishedAt?: string | null
}

export const apiCreateMinute = (payload: CreateMinutePayload) =>
  apiFetch<MinuteResponse>(BASE, { method: 'POST', body: JSON.stringify(payload) })

export type UpdateMinutePayload = Partial<CreateMinutePayload>

export const apiUpdateMinute = (id: string, payload: UpdateMinutePayload) =>
  apiFetch<MinuteResponse>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })

export const apiDeleteMinute = (id: string) =>
  apiFetch<{ message: string }>(`${BASE}/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ confirm: true }),
  })
