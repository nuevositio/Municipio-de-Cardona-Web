import { clearAdminToken, getAdminToken } from '@/lib/auth-storage'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export interface ApiCouncilMinute {
  id: number
  title: string
  date: string
  description: string
  file: string
  createdAt: string
  updatedAt: string
}

async function apiRequest<T>(path: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, headers, ...rest } = options

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      ...(headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    let message = 'No se pudo procesar la solicitud.'
    try {
      const data = (await response.json()) as { message?: string }
      message = data.message ?? message
    } catch { /* sin cuerpo JSON */ }
    if (response.status === 401) clearAdminToken()
    throw new Error(message)
  }

  return (await response.json()) as T
}

export function getCouncilMinuteFileUrl(file: string) {
  if (!file) return ''
  if (file.startsWith('http')) return file
  return `${API_BASE}${file}`
}

export async function getPublicCouncilMinutes() {
  return apiRequest<ApiCouncilMinute[]>('/api/council-minutes')
}

export async function getAdminCouncilMinutes() {
  const token = getAdminToken()
  if (!token) throw new Error('No autenticado.')
  return apiRequest<ApiCouncilMinute[]>('/api/council-minutes', { token })
}

export async function createAdminCouncilMinute(payload: FormData) {
  const token = getAdminToken()
  if (!token) throw new Error('No autenticado.')
  return apiRequest<ApiCouncilMinute>('/api/council-minutes', {
    method: 'POST',
    body: payload,
    token,
  })
}

export async function updateAdminCouncilMinute(id: number, payload: FormData) {
  const token = getAdminToken()
  if (!token) throw new Error('No autenticado.')
  return apiRequest<ApiCouncilMinute>(`/api/council-minutes/${id}`, {
    method: 'PUT',
    body: payload,
    token,
  })
}

export async function deleteAdminCouncilMinute(id: number) {
  const token = getAdminToken()
  if (!token) throw new Error('No autenticado.')
  return apiRequest<{ ok: boolean }>(`/api/council-minutes/${id}`, {
    method: 'DELETE',
    token,
  })
}
