/**
 * Rutas públicas — sin autenticación.
 * Solo lectura de contenido publicado (news, actas, resoluciones).
 */
import { Router } from 'express'
import { listNews, countNews, findNewsBySlug } from '../models/news.model.js'
import { listMinutes } from '../models/minute.model.js'
import { listResolutions } from '../models/resolution.model.js'
import { AppError } from '../middlewares/error-handler.js'
import { parsePagination } from '../utils/content-helpers.js'
import type { NewsItem, Minute, Resolution } from '../types/index.js'

export const publicRouter = Router()

// ── Helpers de serialización ──────────────────────────────────────────────────

function newsToPublic(row: NewsItem) {
  return {
    id:          row.id,
    title:       row.title,
    slug:        row.slug,
    excerpt:     row.excerpt,
    content:     row.content,
    imageUrl:    row.imageUrl,
    publishedAt: row.publishedAt,
    createdAt:   row.createdAt,
    updatedAt:   row.updatedAt,
  }
}

function minuteToPublic(row: Minute) {
  return {
    id:          row.id,
    title:       row.title,
    slug:        row.slug,
    summary:     row.summary,
    fileUrl:     row.fileUrl,
    publishedAt: row.publishedAt,
    createdAt:   row.createdAt,
    updatedAt:   row.updatedAt,
  }
}

function resolutionToPublic(row: Resolution) {
  return {
    id:          row.id,
    title:       row.title,
    slug:        row.slug,
    summary:     row.summary,
    fileUrl:     row.fileUrl,
    publishedAt: row.publishedAt,
    createdAt:   row.createdAt,
    updatedAt:   row.updatedAt,
  }
}

// ── GET /api/news ─────────────────────────────────────────────────────────────

publicRouter.get('/news', async (req, res, next) => {
  try {
    const { limit, offset } = parsePagination(
      req.query as Record<string, string | undefined>,
    )
    const [items, total] = await Promise.all([
      listNews({ publishedOnly: true, limit, offset }),
      countNews(true),
    ])
    res.json({ total, limit, offset, items: items.map(newsToPublic) })
  } catch (err) {
    next(err)
  }
})

// ── GET /api/news/:slug ───────────────────────────────────────────────────────

publicRouter.get('/news/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new AppError(400, 'Slug inválido.')
    }
    const item = await findNewsBySlug(slug)
    if (!item || item.status !== 'published') {
      throw new AppError(404, 'Noticia no encontrada.')
    }
    res.json(newsToPublic(item))
  } catch (err) {
    next(err)
  }
})

// ── GET /api/council-minutes ──────────────────────────────────────────────────

publicRouter.get('/council-minutes', async (req, res, next) => {
  try {
    const { limit, offset } = parsePagination(
      req.query as Record<string, string | undefined>,
    )
    const items = await listMinutes({ publishedOnly: true, limit, offset })
    res.json(items.map(minuteToPublic))
  } catch (err) {
    next(err)
  }
})

// ── GET /api/resolutions ──────────────────────────────────────────────────────

publicRouter.get('/resolutions', async (req, res, next) => {
  try {
    const { limit, offset } = parsePagination(
      req.query as Record<string, string | undefined>,
    )
    const items = await listResolutions({ publishedOnly: true, limit, offset })
    res.json(items.map(resolutionToPublic))
  } catch (err) {
    next(err)
  }
})
