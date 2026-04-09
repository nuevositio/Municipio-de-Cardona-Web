// ── Tipos de dominio ──────────────────────────────────────────────────────────
export type {
  UserRole,
  User,
  AuditLog,
  NewsItem,
  Minute,
  Resolution,
  SessionUser,
} from '../types/index.js'

// ── Modelo: users ─────────────────────────────────────────────────────────────
export {
  findUserById,
  findUserByUsername,
  findUserByEmail,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  incrementFailedAttempts,
  lockUserUntil,
  resetFailedAttempts,
} from './user.model.js'
export type { CreateUserInput, UpdateUserInput } from './user.model.js'

// ── Modelo: audit_logs ────────────────────────────────────────────────────────
export {
  createAuditLog,
  listAuditLogs,
  countAuditLogs,
} from './audit-log.model.js'
export type { CreateAuditLogInput } from './audit-log.model.js'

// ── Modelo: news ──────────────────────────────────────────────────────────────
export {
  findNewsById,
  findNewsBySlug,
  listNews,
  countNews,
  createNews,
  updateNews,
  deleteNews,
  slugExistsInNews,
} from './news.model.js'
export type { CreateNewsInput, UpdateNewsInput, ListNewsOptions } from './news.model.js'

// ── Modelo: minutes ───────────────────────────────────────────────────────────
export {
  findMinuteById,
  findMinuteBySlug,
  listMinutes,
  countMinutes,
  createMinute,
  updateMinute,
  deleteMinute,
  slugExistsInMinutes,
} from './minute.model.js'
export type { CreateMinuteInput, UpdateMinuteInput, ListMinutesOptions } from './minute.model.js'

// ── Modelo: resolutions ───────────────────────────────────────────────────────
export {
  findResolutionById,
  findResolutionBySlug,
  listResolutions,
  countResolutions,
  createResolution,
  updateResolution,
  deleteResolution,
  slugExistsInResolutions,
} from './resolution.model.js'
export type { CreateResolutionInput, UpdateResolutionInput, ListResolutionsOptions } from './resolution.model.js'

