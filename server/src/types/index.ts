/**
 * Tipos del dominio — Milocapp Cardona Cloud
 *
 * Los tipos de base de datos se infieren directamente desde el schema de
 * Drizzle (ver server/src/db/schema.ts).  Aquí se definen solo los tipos
 * de aplicación (DTOs de sesión, roles, etc.).
 */

// ── Re-exportar desde schema ───────────────────────────────────────────────────
export type {
  User,
  NewUser,
  AuditLog,
  NewAuditLog,
  NewsItem,
  NewNewsItem,
  Minute,
  NewMinute,
  Resolution,
  NewResolution,
} from '../db/schema.js'

// ── Roles ─────────────────────────────────────────────────────────────────────
// Refleja el enum `user_role` del schema Drizzle.
export type UserRole = 'superadmin' | 'admin' | 'editor' | 'prensa' | 'consulta'

// ── DTO de sesión (solo los campos que se guardan en la cookie) ───────────────
export interface SessionUser {
  id: string       // UUID
  username: string
  role: UserRole
}

