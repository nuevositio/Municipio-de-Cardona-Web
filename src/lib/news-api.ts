import { clearAdminToken, getAdminToken } from '@/lib/auth-storage'
import type { NewsItem } from '@/types/content'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export const MAX_IMAGE_SIZE = 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface ApiNewsItem {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  token: string
  user: {
    username: string
  }
}

interface RequestOptions extends RequestInit {
  token?: string
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
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
    } catch {
      // Respuesta sin cuerpo JSON.
    }

    if (response.status === 401) {
      clearAdminToken()
    }

    throw new Error(message)
  }

  return (await response.json()) as T
}

export async function getPublicNews() {
  return apiRequest<ApiNewsItem[]>('/api/news')
}

export async function getPublicNewsBySlug(slug: string) {
  return apiRequest<ApiNewsItem>(`/api/news/${slug}`)
}

export async function loginAdmin(username: string, password: string) {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
}

export async function getAdminSession() {
  const token = getAdminToken()

  if (!token) {
    throw new Error('No autenticado.')
  }

  return apiRequest<{ user: { username: string } }>('/api/auth/me', {
    token,
  })
}

export async function getAdminNews() {
  const token = getAdminToken()

  if (!token) {
    throw new Error('No autenticado.')
  }

  return apiRequest<ApiNewsItem[]>('/api/news', {
    token,
  })
}

export async function createAdminNews(payload: FormData) {
  const token = getAdminToken()

  if (!token) {
    throw new Error('No autenticado.')
  }

  return apiRequest<ApiNewsItem>('/api/news', {
    method: 'POST',
    body: payload,
    token,
  })
}

export async function updateAdminNews(id: number, payload: FormData) {
  const token = getAdminToken()

  if (!token) {
    throw new Error('No autenticado.')
  }

  return apiRequest<ApiNewsItem>(`/api/news/${id}`, {
    method: 'PUT',
    body: payload,
    token,
  })
}

export async function deleteAdminNews(id: number) {
  const token = getAdminToken()

  if (!token) {
    throw new Error('No autenticado.')
  }

  return apiRequest<{ success: boolean }>(`/api/news/${id}`, {
    method: 'DELETE',
    token,
  })
}

export function getImagePreviewUrl(imagePath: string) {
  if (!imagePath) {
    return ''
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  return `${API_BASE}${imagePath}`
}

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Formato no permitido. Usa JPG, JPEG, PNG o WEBP.'
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'La imagen supera 1 MB. Objetivo recomendado: entre 512 KB y 1 MB.'
  }

  return null
}

export function toPublicNewsItem(item: ApiNewsItem): NewsItem {
  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    image: getImagePreviewUrl(item.image),
    date: item.date,
    category: 'Institucional',
    featured: false,
  }
}
