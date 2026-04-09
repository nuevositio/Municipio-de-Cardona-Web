import type { AdminUser } from '../types/index.js'
import { API_BASE } from '../../lib/api-base.js'

const BASE = `${API_BASE}/api/admin/auth`

// Todas las peticiones incluyen credentials para enviar la cookie de sesión.
const opts: RequestInit = { credentials: 'include' }

// ── POST /api/admin/auth/login ────────────────────────────────────────────────

export interface LoginResult {
  user: AdminUser
  mustChangePassword: boolean
}

export async function apiLogin(
  username: string,
  password: string,
  captchaToken: string,
): Promise<LoginResult> {
  const res = await fetch(`${BASE}/login`, {
    ...opts,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, captchaToken }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message ?? 'Error al iniciar sesión.')
  }

  return data as LoginResult
}

// ── POST /api/admin/auth/logout ───────────────────────────────────────────────

export async function apiLogout(): Promise<void> {
  await fetch(`${BASE}/logout`, { ...opts, method: 'POST' })
}

// ── GET /api/admin/auth/me ────────────────────────────────────────────────────

export async function apiMe(): Promise<AdminUser> {
  const res = await fetch(`${BASE}/me`, opts)

  if (!res.ok) {
    throw new Error('No autenticado.')
  }

  const data = await res.json()
  return data.user as AdminUser
}
