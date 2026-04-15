import { eq, and, desc, count } from 'drizzle-orm';
import { getDb } from '../db/connection.js';
import { auditLogs } from '../db/schema.js';
export async function createAuditLog(input) {
    const db = getDb();
    const details = input.details !== null && typeof input.details === 'object'
        ? JSON.stringify(input.details)
        : (input.details ?? null);
    await db.insert(auditLogs).values({
        userId: input.userId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        details,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
    });
}
export async function listAuditLogs(options = {}) {
    const db = getDb();
    const conditions = [];
    if (options.entityType !== undefined)
        conditions.push(eq(auditLogs.entityType, options.entityType));
    if (options.entityId !== undefined)
        conditions.push(eq(auditLogs.entityId, options.entityId));
    if (options.userId !== undefined)
        conditions.push(eq(auditLogs.userId, options.userId));
    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;
    const query = db
        .select()
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset);
    if (conditions.length > 0) {
        return query.where(and(...conditions));
    }
    return query;
}
export async function countAuditLogs(options = {}) {
    const db = getDb();
    const conditions = [];
    if (options.entityType !== undefined)
        conditions.push(eq(auditLogs.entityType, options.entityType));
    if (options.entityId !== undefined)
        conditions.push(eq(auditLogs.entityId, options.entityId));
    if (options.userId !== undefined)
        conditions.push(eq(auditLogs.userId, options.userId));
    const query = db.select({ total: count() }).from(auditLogs);
    const [result] = conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;
    return result?.total ?? 0;
}
//# sourceMappingURL=audit-log.model.js.map