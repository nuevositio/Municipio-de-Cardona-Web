import { eq, isNull, and, lte, desc, sql, count } from 'drizzle-orm'
import { getDb } from '../db/connection.js'
import { news } from '../db/schema.js'
import type { NewsItem, NewNewsItem } from '../types/index.js'

// ── Tipos de entrada ──────────────────────────────────────────────────────────

export interface CreateNewsInput {
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl?: string
  status?: 'draft' | 'published'
  publishedAt?: Date | null
  createdBy?: string | null
}

export interface UpdateNewsInput {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  imageUrl?: string
  status?: 'draft' | 'published'
  publishedAt?: Date | null
  updatedBy?: string | null
}

export interface ListNewsOptions {
  publishedOnly?: boolean
  limit?: number
  offset?: number
}

// ── Queries ───────────────────────────────────────────────────────────────────

export async function findNewsById(id: string): Promise<NewsItem | undefined> {
  const db = getDb()
  const [item] = await db
    .select()
    .from(news)
    .where(and(eq(news.id, id), isNull(news.deletedAt)))
    .limit(1)
  return item
}

export async function findNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  const db = getDb()
  const [item] = await db
    .select()
    .from(news)
    .where(and(eq(news.slug, slug), isNull(news.deletedAt)))
    .limit(1)
  return item
}

export async function listNews(options: ListNewsOptions = {}): Promise<NewsItem[]> {
  const { publishedOnly = false, limit = 20, offset = 0 } = options
  const db = getDb()

  const conditions = [isNull(news.deletedAt)]
  if (publishedOnly) {
    conditions.push(
      eq(news.status, 'published'),
      lte(news.publishedAt, new Date()),
    )
  }

  return db
    .select()
    .from(news)
    .where(and(...conditions))
    .orderBy(desc(news.publishedAt), desc(news.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function countNews(publishedOnly = false): Promise<number> {
  const db = getDb()
  const conditions = [isNull(news.deletedAt)]
  if (publishedOnly) {
    conditions.push(eq(news.status, 'published'), lte(news.publishedAt, new Date()))
  }
  const [result] = await db
    .select({ total: count() })
    .from(news)
    .where(and(...conditions))
  return result?.total ?? 0
}

export async function createNews(input: CreateNewsInput): Promise<NewsItem> {
  const db = getDb()
  const [item] = await db
    .insert(news)
    .values({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      imageUrl: input.imageUrl ?? '',
      status: input.status ?? 'draft',
      publishedAt: input.publishedAt ?? null,
      createdBy: input.createdBy ?? null,
      updatedBy: input.createdBy ?? null,
    } satisfies Partial<NewNewsItem>)
    .returning()
  if (!item) throw new Error('createNews did not return a row')
  return item
}

export async function updateNews(id: string, input: UpdateNewsInput): Promise<NewsItem | undefined> {
  const db = getDb()
  const patch: Partial<NewNewsItem> = { updatedAt: new Date() }

  if (input.title !== undefined)       patch.title = input.title
  if (input.slug !== undefined)        patch.slug = input.slug
  if (input.excerpt !== undefined)     patch.excerpt = input.excerpt
  if (input.content !== undefined)     patch.content = input.content
  if (input.imageUrl !== undefined)    patch.imageUrl = input.imageUrl
  if (input.status !== undefined)      patch.status = input.status
  if ('publishedAt' in input)          patch.publishedAt = input.publishedAt ?? null
  if (input.updatedBy !== undefined)   patch.updatedBy = input.updatedBy ?? null

  const [updated] = await db
    .update(news)
    .set(patch)
    .where(and(eq(news.id, id), isNull(news.deletedAt)))
    .returning()
  return updated
}

/** Soft delete */
export async function deleteNews(id: string): Promise<void> {
  const db = getDb()
  await db
    .update(news)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(news.id, id))
}

export async function slugExistsInNews(slug: string, exceptId?: string): Promise<boolean> {
  const db = getDb()
  const conditions = [eq(news.slug, slug), isNull(news.deletedAt)]
  if (exceptId) conditions.push(sql`${news.id} != ${exceptId}`)
  const [row] = await db
    .select({ id: news.id })
    .from(news)
    .where(and(...conditions))
    .limit(1)
  return row !== undefined
}

