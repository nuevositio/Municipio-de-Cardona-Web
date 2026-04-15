import { eq, isNull, and, lte, desc, sql, count } from 'drizzle-orm';
import { getDb } from '../db/connection.js';
import { resolutions } from '../db/schema.js';
export async function findResolutionById(id) {
    const db = getDb();
    const [item] = await db
        .select()
        .from(resolutions)
        .where(and(eq(resolutions.id, id), isNull(resolutions.deletedAt)))
        .limit(1);
    return item;
}
export async function findResolutionBySlug(slug) {
    const db = getDb();
    const [item] = await db
        .select()
        .from(resolutions)
        .where(and(eq(resolutions.slug, slug), isNull(resolutions.deletedAt)))
        .limit(1);
    return item;
}
export async function listResolutions(options = {}) {
    const { publishedOnly = false, limit = 20, offset = 0 } = options;
    const db = getDb();
    const conditions = [isNull(resolutions.deletedAt)];
    if (publishedOnly) {
        conditions.push(eq(resolutions.status, 'published'), lte(resolutions.publishedAt, new Date()));
    }
    return db
        .select()
        .from(resolutions)
        .where(and(...conditions))
        .orderBy(desc(resolutions.publishedAt), desc(resolutions.createdAt))
        .limit(limit)
        .offset(offset);
}
export async function countResolutions(publishedOnly = false) {
    const db = getDb();
    const conditions = [isNull(resolutions.deletedAt)];
    if (publishedOnly) {
        conditions.push(eq(resolutions.status, 'published'), lte(resolutions.publishedAt, new Date()));
    }
    const [result] = await db
        .select({ total: count() })
        .from(resolutions)
        .where(and(...conditions));
    return result?.total ?? 0;
}
export async function createResolution(input) {
    const db = getDb();
    const [item] = await db
        .insert(resolutions)
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
        throw new Error('createResolution did not return a row');
    return item;
}
export async function updateResolution(id, input) {
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
        .update(resolutions)
        .set(patch)
        .where(and(eq(resolutions.id, id), isNull(resolutions.deletedAt)))
        .returning();
    return updated;
}
export async function deleteResolution(id) {
    const db = getDb();
    await db
        .update(resolutions)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(resolutions.id, id));
}
export async function slugExistsInResolutions(slug, exceptId) {
    const db = getDb();
    const conditions = [eq(resolutions.slug, slug), isNull(resolutions.deletedAt)];
    if (exceptId)
        conditions.push(sql `${resolutions.id} != ${exceptId}`);
    const [row] = await db
        .select({ id: resolutions.id })
        .from(resolutions)
        .where(and(...conditions))
        .limit(1);
    return row !== undefined;
}
//# sourceMappingURL=resolution.model.js.map