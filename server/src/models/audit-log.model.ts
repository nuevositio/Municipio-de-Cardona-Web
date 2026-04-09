import { eq, and, desc, count } from 'drizzle-orm'
import { getDb } from '../db/connection.js'
import { auditLogs } from '../db/schema.js'
import type { AuditLog, NewAuditLog } from '../types/index.js'

export interface CreateAuditLogInput {
  userId?: string | null
  action: string
  entityType: string
  entityId?: string | null
  details?: Record<string, unknown> | string | null
  ipAddress?: string | null
  userAgent?: string | null
}

export async function createAuditLog(input: CreateAuditLogInput): Promise<void> {
  const db = getDb()
  const details =
    input.details !== null && typeof input.details === 'object'
      ? JSON.stringify(input.details)
      : (input.details ?? null)

  await db.insert(auditLogs).values({
    userId: input.userId ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    details,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
  } satisfies Partial<NewAuditLog>)
}

export interface ListAuditLogsOptions {
  entityType?: string
  entityId?: string
  userId?: string
  limit?: number
  offset?: number
}

export async function listAuditLogs(options: ListAuditLogsOptions = {}): Promise<AuditLog[]> {
  const db = getDb()
  const conditions = []

  if (options.entityType !== undefined) conditions.push(eq(auditLogs.entityType, options.entityType))
  if (options.entityId  !== undefined)  conditions.push(eq(auditLogs.entityId,  options.entityId))
  if (options.userId    !== undefined)  conditions.push(eq(auditLogs.userId,    options.userId))

  const limit  = options.limit  ?? 50
  const offset = options.offset ?? 0

  const query = db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit)
    .offset(offset)

  if (conditions.length > 0) {
    return query.where(and(...conditions))
  }
  return query
}

export async function countAuditLogs(options: Omit<ListAuditLogsOptions, 'limit' | 'offset'> = {}): Promise<number> {
  const db = getDb()
  const conditions = []

  if (options.entityType !== undefined) conditions.push(eq(auditLogs.entityType, options.entityType))
  if (options.entityId  !== undefined)  conditions.push(eq(auditLogs.entityId,  options.entityId))
  if (options.userId    !== undefined)  conditions.push(eq(auditLogs.userId,    options.userId))

  const query = db.select({ total: count() }).from(auditLogs)
  const [result] = conditions.length > 0
    ? await query.where(and(...conditions))
    : await query

  return result?.total ?? 0
}
