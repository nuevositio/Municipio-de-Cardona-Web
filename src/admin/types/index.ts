export type AdminRole = 'superadmin' | 'admin' | 'editor' | 'prensa' | 'consulta'

// Espejo del SessionUser del servidor
export interface AdminUser {
  id: string
  username: string
  role: AdminRole
  mustChangePassword?: boolean
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

// ── Entidades del panel ───────────────────────────────────────────────────────

export interface UserItem {
  id: string
  username: string
  email: string
  role: AdminRole
  isActive: boolean
  mustChangePassword: boolean
  failedLoginAttempts: number
  lockedUntil: string | null
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  imageUrl: string | null
  status: 'published' | 'draft'
  publishedAt: string | null
  createdBy: string | null
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface MinuteItem {
  id: string
  title: string
  slug: string
  summary: string | null
  fileUrl: string | null
  status: 'published' | 'draft'
  publishedAt: string | null
  createdBy: string | null
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export type ResolutionItem = MinuteItem
