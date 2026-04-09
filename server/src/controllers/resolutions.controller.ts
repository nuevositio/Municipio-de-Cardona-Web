import type { Request, Response, NextFunction } from 'express'
import {
  listResolutions,
  countResolutions,
  findResolutionById,
  createResolution,
  updateResolution,
  deleteResolution,
  slugExistsInResolutions,
} from '../models/resolution.model.js'
import { createAuditLog } from '../models/audit-log.model.js'
import { AppError } from '../middlewares/error-handler.js'
import { createResolutionSchema, updateResolutionSchema } from '../validators/index.js'
import { slugify, buildUniqueSlug, parseUuidParam, parsePagination } from '../utils/content-helpers.js'
import type { Resolution } from '../types/index.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

async function uniqueSlug(title: string, exceptId?: string): Promise<string> {
  return buildUniqueSlug(title, slugExistsInResolutions, exceptId)
}

function toDTO(row: Resolution) {
  return {
    id:          row.id,
    title:       row.title,
    slug:        row.slug,
    summary:     row.summary,
    fileUrl:     row.fileUrl,
    status:      row.status,
    publishedAt: row.publishedAt,
    createdBy:   row.createdBy,
    updatedBy:   row.updatedBy,
    createdAt:   row.createdAt,
    updatedAt:   row.updatedAt,
  }
}

// ── GET /api/admin/resolutions ────────────────────────────────────────────────

export async function listResolutionsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { limit, offset } = parsePagination(
      req.query as Record<string, string | undefined>,
    )
    const [items, total] = await Promise.all([
      listResolutions({ limit, offset }),
      countResolutions(),
    ])
    res.json({ total, limit, offset, items: items.map(toDTO) })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/admin/resolutions/:id ────────────────────────────────────────────

export async function getResolutionController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id   = parseUuidParam(req.params.id)
    const item = await findResolutionById(id)
    if (!item) throw new AppError(404, 'Resolución no encontrada.')
    res.json({ item: toDTO(item) })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/admin/resolutions ───────────────────────────────────────────────

export async function createResolutionController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actor  = req.session.user!
    const parsed = createResolutionSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos inválidos.',
        errors:  parsed.error.flatten().fieldErrors,
      })
      return
    }

    const { title, summary, fileUrl, publishedAt } = parsed.data

    const rawSlug   = parsed.data.slug ?? slugify(title)
    const finalSlug = (await slugExistsInResolutions(rawSlug))
      ? await uniqueSlug(title)
      : rawSlug

    const item = await createResolution({
      title,
      slug:        finalSlug,
      summary,
      fileUrl,
      status:      publishedAt ? 'published' : 'draft',
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      createdBy:   actor.id,
    })

    void createAuditLog({
      userId:     actor.id,
      action:     'resolution_created',
      entityType: 'resolution',
      entityId:   item.id,
      details:    { title, slug: finalSlug, publishedAt: publishedAt ?? null },
      ipAddress:  req.ip ?? null,
      userAgent:  req.headers['user-agent'] ?? null,
    })

    res.status(201).json({ item: toDTO(item) })
  } catch (err) {
    next(err)
  }
}

// ── PATCH /api/admin/resolutions/:id ──────────────────────────────────────────

export async function updateResolutionController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actor    = req.session.user!
    const id       = parseUuidParam(req.params.id)
    const existing = await findResolutionById(id)
    if (!existing) throw new AppError(404, 'Resolución no encontrada.')

    const parsed = updateResolutionSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos inválidos.',
        errors:  parsed.error.flatten().fieldErrors,
      })
      return
    }

    const data = parsed.data

    if (data.slug !== undefined && data.slug !== existing.slug) {
      if (await slugExistsInResolutions(data.slug, id)) {
        throw new AppError(409, `El slug '${data.slug}' ya está en uso.`)
      }
    }

    if (data.title !== undefined && data.slug === undefined) {
      const proposed = slugify(data.title)
      if (proposed !== existing.slug) {
        data.slug = (await slugExistsInResolutions(proposed, id))
          ? await uniqueSlug(data.title, id)
          : proposed
      }
    }

    const { publishedAt: pubAtStr, ...restData } = data
    const updateInput: Parameters<typeof updateResolution>[1] = {
      ...restData,
      updatedBy: actor.id,
    }
    if ('publishedAt' in data) {
      updateInput.publishedAt = pubAtStr ? new Date(pubAtStr) : null
      updateInput.status      = pubAtStr ? 'published' : 'draft'
    }

    const updated = await updateResolution(id, updateInput)
    if (!updated) throw new AppError(404, 'Resolución no encontrada.')

    void createAuditLog({
      userId:     actor.id,
      action:     'resolution_updated',
      entityType: 'resolution',
      entityId:   id,
      details:    { changes: data },
      ipAddress:  req.ip ?? null,
      userAgent:  req.headers['user-agent'] ?? null,
    })

    res.json({ item: toDTO(updated) })
  } catch (err) {
    next(err)
  }
}

// ── DELETE /api/admin/resolutions/:id ─────────────────────────────────────────

export async function deleteResolutionController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actor    = req.session.user!
    const id       = parseUuidParam(req.params.id)
    const existing = await findResolutionById(id)
    if (!existing) throw new AppError(404, 'Resolución no encontrada.')

    if (req.body?.confirm !== true) {
      throw new AppError(
        400,
        'Debes confirmar la eliminación enviando { "confirm": true } en el cuerpo.',
      )
    }

    await deleteResolution(id)

    void createAuditLog({
      userId:     actor.id,
      action:     'resolution_deleted',
      entityType: 'resolution',
      entityId:   id,
      details:    { title: existing.title, slug: existing.slug },
      ipAddress:  req.ip ?? null,
      userAgent:  req.headers['user-agent'] ?? null,
    })

    res.json({ message: 'Resolución eliminada correctamente.' })
  } catch (err) {
    next(err)
  }
}
