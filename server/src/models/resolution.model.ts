import { eq, isNull, and, lte, desc, sql, count } from 'drizzle-orm'
import { getDb } from '../db/connection.js'
import { resolutions } from '../db/schema.js'
import type { Resolution, NewResolution } from '../types/index.js'

export interface CreateResolutionInput {
  title: string
  slug: string
  summary?: string
  fileUrl: string
  status?: 'draft' | 'published'
  publishedAt?: Date | null
  createdBy?: string | null
}

export interface UpdateResolutionInput {
  title?: string
  slug?: string
  summary?: string
  fileUrl?: string
  status?: 'draft' | 'published'
  publishedAt?: Date | null
  updatedBy?: string | null
}

export interface ListResolutionsOptions {
  publishedOnly?: boolean
  limit?: number
  offset?: number
}

export async function findResolutionById(id: string): Promise<Resolution | undefined> {
  const db = getDb()
  const [item] = await db
    .select()
    .from(resolutions)
    .where(and(eq(resolutions.id, id), isNull(resolutions.deletedAt)))
    .limit(1)
  return item
}

export async function findResolutionBySlug(slug: string): Promise<Resolution | undefined> {
  const db = getDb()
  const [item] = await db
    .select()
    .from(resolutions)
    .where(and(eq(resolutions.slug, slug), isNull(resolutions.deletedAt)))
    .limit(1)
  return item
}

export async function listResolutions(options: ListResolutionsOptions = {}): Promise<Resolution[]> {
  const { publishedOnly = false, limit = 20, offset = 0 } = options
  const db = getDb()
  const conditions = [isNull(resolutions.deletedAt)]
  if (publishedOnly) {
    conditions.push(
      eq(resolutions.status, 'published'),
      lte(resolutions.publishedAt, new Date()),
    )
  }
  return db
    .select()
    .from(resolutions)
    .where(and(...conditions))
    .orderBy(desc(resolutions.publishedAt), desc(resolutions.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function countResolutions(publishedOnly = false): Promise<number> {
  const db = getDb()
  const conditions = [isNull(resolutions.deletedAt)]
  if (publishedOnly) {
    conditions.push(
      eq(resolutions.status, 'published'),
      lte(resolutions.publishedAt, new Date()),
    )
  }
  const [result] = await db
    .select({ total: count() })
    .from(resolutions)
    .where(and(...conditions))
  return result?.total ?? 0
}

export async function createResolution(input: CreateResolutionInput): Promise<Resolution> {
  const db = getDb()
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
    } satisfies Partial<NewResolution>)
    .returning()
  if (!item) throw new Error('createResolution did not return a row')
  return item
}

export async function updateResolution(
  id: string,
  input: UpdateResolutionInput,
): Promise<Resolution | undefined> {
  const db = getDb()
  const patch: Partial<NewResolution> = { updatedAt: new Date() }

  if (input.title !== undefined)      patch.title = input.title
  if (input.slug !== undefined)       patch.slug = input.slug
  if (input.summary !== undefined)    patch.summary = input.summary
  if (input.fileUrl !== undefined)    patch.fileUrl = input.fileUrl
  if (input.status !== undefined)     patch.status = input.status
  if ('publishedAt' in input)         patch.publishedAt = input.publishedAt ?? null
  if (input.updatedBy !== undefined)  patch.updatedBy = input.updatedBy ?? null

  const [updated] = await db
    .update(resolutions)
    .set(patch)
    .where(and(eq(resolutions.id, id), isNull(resolutions.deletedAt)))
    .returning()
  return updated
}

export async function deleteResolution(id: string): Promise<void> {
  const db = getDb()
  await db
    .update(resolutions)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(resolutions.id, id))
}

export async function slugExistsInResolutions(
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  const db = getDb()
  const conditions = [eq(resolutions.slug, slug), isNull(resolutions.deletedAt)]
  if (exceptId) conditions.push(sql`${resolutions.id} != ${exceptId}`)
  const [row] = await db
    .select({ id: resolutions.id })
    .from(resolutions)
    .where(and(...conditions))
    .limit(1)
  return row !== undefined
}

