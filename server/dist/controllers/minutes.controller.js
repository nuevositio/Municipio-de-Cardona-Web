import { listMinutes, countMinutes, findMinuteById, createMinute, updateMinute, deleteMinute, slugExistsInMinutes, } from '../models/minute.model.js';
import { createAuditLog } from '../models/audit-log.model.js';
import { AppError } from '../middlewares/error-handler.js';
import { createMinuteSchema, updateMinuteSchema } from '../validators/index.js';
import { slugify, buildUniqueSlug, parseUuidParam, parsePagination } from '../utils/content-helpers.js';
// ── Helpers ───────────────────────────────────────────────────────────────────
async function uniqueSlug(title, exceptId) {
    return buildUniqueSlug(title, slugExistsInMinutes, exceptId);
}
function toDTO(row) {
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        fileUrl: row.fileUrl,
        status: row.status,
        publishedAt: row.publishedAt,
        createdBy: row.createdBy,
        updatedBy: row.updatedBy,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}
// ── GET /api/admin/minutes ────────────────────────────────────────────────────
export async function listMinutesController(req, res, next) {
    try {
        const { limit, offset } = parsePagination(req.query);
        const [items, total] = await Promise.all([
            listMinutes({ limit, offset }),
            countMinutes(),
        ]);
        res.json({ total, limit, offset, items: items.map(toDTO) });
    }
    catch (err) {
        next(err);
    }
}
// ── GET /api/admin/minutes/:id ────────────────────────────────────────────────
export async function getMinuteController(req, res, next) {
    try {
        const id = parseUuidParam(req.params.id);
        const item = await findMinuteById(id);
        if (!item)
            throw new AppError(404, 'Acta no encontrada.');
        res.json({ item: toDTO(item) });
    }
    catch (err) {
        next(err);
    }
}
// ── POST /api/admin/minutes ───────────────────────────────────────────────────
export async function createMinuteController(req, res, next) {
    try {
        const actor = req.session.user;
        const parsed = createMinuteSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                message: 'Datos inválidos.',
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { title, summary, fileUrl, publishedAt } = parsed.data;
        const rawSlug = parsed.data.slug ?? slugify(title);
        const finalSlug = (await slugExistsInMinutes(rawSlug))
            ? await uniqueSlug(title)
            : rawSlug;
        const item = await createMinute({
            title,
            slug: finalSlug,
            summary,
            fileUrl,
            status: publishedAt ? 'published' : 'draft',
            publishedAt: publishedAt ? new Date(publishedAt) : null,
            createdBy: actor.id,
        });
        void createAuditLog({
            userId: actor.id,
            action: 'minute_created',
            entityType: 'minute',
            entityId: item.id,
            details: { title, slug: finalSlug, publishedAt: publishedAt ?? null },
            ipAddress: req.ip ?? null,
            userAgent: req.headers['user-agent'] ?? null,
        });
        res.status(201).json({ item: toDTO(item) });
    }
    catch (err) {
        next(err);
    }
}
// ── PATCH /api/admin/minutes/:id ──────────────────────────────────────────────
export async function updateMinuteController(req, res, next) {
    try {
        const actor = req.session.user;
        const id = parseUuidParam(req.params.id);
        const existing = await findMinuteById(id);
        if (!existing)
            throw new AppError(404, 'Acta no encontrada.');
        const parsed = updateMinuteSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                message: 'Datos inválidos.',
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const data = parsed.data;
        if (data.slug !== undefined && data.slug !== existing.slug) {
            if (await slugExistsInMinutes(data.slug, id)) {
                throw new AppError(409, `El slug '${data.slug}' ya está en uso.`);
            }
        }
        if (data.title !== undefined && data.slug === undefined) {
            const proposed = slugify(data.title);
            if (proposed !== existing.slug) {
                data.slug = (await slugExistsInMinutes(proposed, id))
                    ? await uniqueSlug(data.title, id)
                    : proposed;
            }
        }
        const { publishedAt: pubAtStr, ...restData } = data;
        const updateInput = {
            ...restData,
            updatedBy: actor.id,
        };
        if ('publishedAt' in data) {
            updateInput.publishedAt = pubAtStr ? new Date(pubAtStr) : null;
            updateInput.status = pubAtStr ? 'published' : 'draft';
        }
        const updated = await updateMinute(id, updateInput);
        if (!updated)
            throw new AppError(404, 'Acta no encontrada.');
        void createAuditLog({
            userId: actor.id,
            action: 'minute_updated',
            entityType: 'minute',
            entityId: id,
            details: { changes: data },
            ipAddress: req.ip ?? null,
            userAgent: req.headers['user-agent'] ?? null,
        });
        res.json({ item: toDTO(updated) });
    }
    catch (err) {
        next(err);
    }
}
// ── DELETE /api/admin/minutes/:id ─────────────────────────────────────────────
export async function deleteMinuteController(req, res, next) {
    try {
        const actor = req.session.user;
        const id = parseUuidParam(req.params.id);
        const existing = await findMinuteById(id);
        if (!existing)
            throw new AppError(404, 'Acta no encontrada.');
        if (req.body?.confirm !== true) {
            throw new AppError(400, 'Debes confirmar la eliminación enviando { "confirm": true } en el cuerpo.');
        }
        await deleteMinute(id);
        void createAuditLog({
            userId: actor.id,
            action: 'minute_deleted',
            entityType: 'minute',
            entityId: id,
            details: { title: existing.title, slug: existing.slug },
            ipAddress: req.ip ?? null,
            userAgent: req.headers['user-agent'] ?? null,
        });
        res.json({ message: 'Acta eliminada correctamente.' });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=minutes.controller.js.map