/**
 * Tipos del dominio — Milocapp Cardona Cloud
 *
 * Los tipos de base de datos se infieren directamente desde el schema de
 * Drizzle (ver server/src/db/schema.ts).  Aquí se definen solo los tipos
 * de aplicación (DTOs de sesión, roles, etc.).
 */
export type { User, NewUser, AuditLog, NewAuditLog, NewsItem, NewNewsItem, Minute, NewMinute, Resolution, NewResolution, } from '../db/schema.js';
export type UserRole = 'superadmin' | 'admin' | 'editor' | 'prensa' | 'consulta';
export interface SessionUser {
    id: string;
    username: string;
    role: UserRole;
}
