/**
 * Schema Drizzle ORM — PostgreSQL / Neon
 *
 * Refleja el modelo de datos del CMS municipal con mejoras respecto
 * al schema SQLite original:
 *   - UUIDs como PK principales (uuid_generate_v4)
 *   - Timestamps con timezone
 *   - status explícito ('draft' | 'published')
 *   - índices cubiertos
 *   - trazabilidad (created_by / updated_by)
 */
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ── Enums ─────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', [
  'superadmin',
  'admin',
  'editor',
  'prensa',
  'consulta',
])

export const contentStatusEnum = pgEnum('content_status', ['draft', 'published'])

// ── Users ─────────────────────────────────────────────────────────────────────

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 64 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: userRoleEnum('role').notNull().default('admin'),
    isActive: boolean('is_active').notNull().default(true),
    mustChangePassword: boolean('must_change_password').notNull().default(false),
    failedLoginAttempts: integer('failed_login_attempts').notNull().default(0),
    lockedUntil: timestamp('locked_until', { withTimezone: true }),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    index('idx_users_username').on(t.username),
    index('idx_users_email').on(t.email),
    index('idx_users_role').on(t.role),
  ],
)

// ── Audit Logs ────────────────────────────────────────────────────────────────

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: varchar('action', { length: 64 }).notNull(),
    entityType: varchar('entity_type', { length: 64 }).notNull(),
    entityId: uuid('entity_id'),
    details: text('details'),
    ipAddress: varchar('ip_address', { length: 64 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_audit_logs_user_id').on(t.userId),
    index('idx_audit_logs_entity').on(t.entityType, t.entityId),
    index('idx_audit_logs_created_at').on(t.createdAt),
  ],
)

// ── News ──────────────────────────────────────────────────────────────────────

export const news = pgTable(
  'news',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    excerpt: text('excerpt').notNull(),
    content: text('content').notNull(),
    imageUrl: text('image_url').notNull().default(''),
    status: contentStatusEnum('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('idx_news_slug').on(t.slug),
    index('idx_news_status').on(t.status),
    index('idx_news_published_at').on(t.publishedAt),
  ],
)

// ── Minutes (Actas de concejo) ────────────────────────────────────────────────

export const minutes = pgTable(
  'minutes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    summary: text('summary').notNull().default(''),
    fileUrl: text('file_url').notNull(),
    status: contentStatusEnum('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('idx_minutes_slug').on(t.slug),
    index('idx_minutes_status').on(t.status),
    index('idx_minutes_published_at').on(t.publishedAt),
  ],
)

// ── Resolutions ───────────────────────────────────────────────────────────────

export const resolutions = pgTable(
  'resolutions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    summary: text('summary').notNull().default(''),
    fileUrl: text('file_url').notNull(),
    status: contentStatusEnum('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('idx_resolutions_slug').on(t.slug),
    index('idx_resolutions_status').on(t.status),
    index('idx_resolutions_published_at').on(t.publishedAt),
  ],
)

// ── Relations ─────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  auditLogs: many(auditLogs),
  newsCreated: many(news, { relationName: 'newsCreatedBy' }),
  minutesCreated: many(minutes, { relationName: 'minutesCreatedBy' }),
  resolutionsCreated: many(resolutions, { relationName: 'resolutionsCreatedBy' }),
}))

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}))

export const newsRelations = relations(news, ({ one }) => ({
  creator: one(users, {
    fields: [news.createdBy],
    references: [users.id],
    relationName: 'newsCreatedBy',
  }),
}))

export const minutesRelations = relations(minutes, ({ one }) => ({
  creator: one(users, {
    fields: [minutes.createdBy],
    references: [users.id],
    relationName: 'minutesCreatedBy',
  }),
}))

export const resolutionsRelations = relations(resolutions, ({ one }) => ({
  creator: one(users, {
    fields: [resolutions.createdBy],
    references: [users.id],
    relationName: 'resolutionsCreatedBy',
  }),
}))

// ── Tipos inferidos ───────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type AuditLog = typeof auditLogs.$inferSelect
export type NewAuditLog = typeof auditLogs.$inferInsert
export type NewsItem = typeof news.$inferSelect
export type NewNewsItem = typeof news.$inferInsert
export type Minute = typeof minutes.$inferSelect
export type NewMinute = typeof minutes.$inferInsert
export type Resolution = typeof resolutions.$inferSelect
export type NewResolution = typeof resolutions.$inferInsert
