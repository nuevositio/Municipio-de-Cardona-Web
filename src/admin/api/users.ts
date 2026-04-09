import { apiFetch } from './fetch.js'
import type { UserItem } from '../types/index.js'
import { API_BASE } from '../../lib/api-base.js'

const BASE = `${API_BASE}/api/admin/users`

export interface UsersListResponse { users: UserItem[] }
export interface UserResponse      { user: UserItem }

export const apiGetUsers = () =>
  apiFetch<UsersListResponse>(BASE)

export const apiGetUser = (id: string) =>
  apiFetch<UserResponse>(`${BASE}/${id}`)

// ── Crear ─────────────────────────────────────────────────────────────────────

export interface CreateUserPayload { username: string; email: string; password: string }

export const apiCreateUser = (payload: CreateUserPayload) =>
  apiFetch<UserResponse>(BASE, { method: 'POST', body: JSON.stringify(payload) })

// ── Editar ────────────────────────────────────────────────────────────────────

export interface UpdateUserPayload {
  email?:    string
  role?:     'superadmin' | 'admin' | 'editor' | 'prensa' | 'consulta'
  isActive?: boolean
}

export const apiUpdateUser = (id: string, payload: UpdateUserPayload) =>
  apiFetch<UserResponse>(`${BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

// ── Reset contraseña ──────────────────────────────────────────────────────────

export const apiResetPassword = (id: string, newPassword: string) =>
  apiFetch<{ message: string }>(`${BASE}/${id}/reset-password`, {
    method: 'PATCH',
    body: JSON.stringify({ newPassword }),
  })

// ── Eliminar (soft delete) ────────────────────────────────────────────────────

export const apiDeleteUser = (id: string) =>
  apiFetch<{ message: string }>(`${BASE}/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ confirm: true }),
  })
