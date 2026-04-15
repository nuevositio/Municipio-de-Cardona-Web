import { eq, isNull, and, lte, desc, sql, count } from 'drizzle-orm';
import { getDb } from '../db/connection.js';
import { minutes } from '../db/schema.js';
// ── Queries ───────────────────────────────────────────────────────────────────
export async function findMinuteById(id) {
    const db = getDb();
    const [item] = await db
        .select()
        .from(minutes)
        .where(and(eq(minutes.id, id), isNull(minutes.deletedAt)))
        .limit(1);
    return item;
}
export async function findMinuteBySlug(slug) {
    const db = getDb();
    const [item] = await db
        .select()
        .from(minutes)
        .where(and(eq(minutes.slug, slug), isNull(minutes.deletedAt)))
        .limit(1);
    return item;
}
export async function listMinutes(options = {}) {
    const { publishedOnly = false, limit = 20, offset = 0 } = options;
    const db = getDb();
    const conditions = [isNull(minutes.deletedAt)];
    if (publishedOnly) {
        conditions.push(eq(minutes.status, 'published'), lte(minutes.publishedAt, new Date()));
    }
    return db
        .select()
        .from(minutes)
        .where(and(...conditions))
        .orderBy(desc(minutes.publishedAt), desc(minutes.createdAt))
        .limit(limit)
        .offset(offset);
}
export async function countMinutes(publishedOnly = false) {
    const db = getDb();
    const conditions = [isNull(minutes.deletedAt)];
    if (publishedOnly) {
        conditions.push(eq(minutes.status, 'published'), lte(minutes.publishedAt, new Date()));
    }
    const [result] = await db
        .select({ total: count() })
        .from(minutes)
        .where(and(...conditions));
    return result?.total ?? 0;
}
export async function createMinute(input) {
    const db = getDb();
    const [item] = await db
        .insert(minutes)
        .values({
        title: input.title,
        slug: input.slug,
        summary: input.summary ?? '',
        fileUrl: input.fileUrl,
        status: input.status ?? 'draft',
        publishedAt: input.publishedAt ?? null,
        createdBy: input.createdBy ?? null,
        updatedBy: input.createdBy ?? null,
    })
        .returning();
    if (!item)
        throw new Error('createMinute did not return a row');
    return item;
}
export async function updateMinute(id, input) {
    const db = getDb();
    const patch = { updatedAt: new Date() };
    if (input.title !== undefined)
        patch.title = input.title;
    if (input.slug !== undefined)
        patch.slug = input.slug;
    if (input.summary !== undefined)
        patch.summary = input.summary;
    if (input.fileUrl !== undefined)
        patch.fileUrl = input.fileUrl;
    if (input.status !== undefined)
        patch.status = input.status;
    if ('publishedAt' in input)
        patch.publishedAt = input.publishedAt ?? null;
    if (input.updatedBy !== undefined)
        patch.updatedBy = input.updatedBy ?? null;
    const [updated] = await db
        .update(minutes)
        .set(patch)
        .where(and(eq(minutes.id, id), isNull(minutes.deletedAt)))
        .returning();
    return updated;
}
export async function deleteMinute(id) {
    const db = getDb();
    await db
        .update(minutes)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(minutes.id, id));
}
export async function slugExistsInMinutes(slug, exceptId) {
    const db = getDb();
    const conditions = [eq(minutes.slug, slug), isNull(minutes.deletedAt)];
    if (exceptId)
        conditions.push(sql `${minutes.id} != ${exceptId}`);
    const [row] = await db
        .select({ id: minutes.id })
        .from(minutes)
        .where(and(...conditions))
        .limit(1);
    return row !== undefined;
}
//# sourceMappingURL=minute.model.js.map