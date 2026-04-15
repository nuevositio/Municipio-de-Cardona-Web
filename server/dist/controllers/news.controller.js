import { listNews, countNews, findNewsById, createNews, updateNews, deleteNews, slugExistsInNews, } from '../models/news.model.js';
import { createAuditLog } from '../models/audit-log.model.js';
import { AppError } from '../middlewares/error-handler.js';
import { createNewsSchema, updateNewsSchema } from '../validators/index.js';
import { slugify, buildUniqueSlug, parseUuidParam, parsePagination } from '../utils/content-helpers.js';
// ── Helpers ───────────────────────────────────────────────────────────────────
async function uniqueSlug(base, exceptId) {
    return buildUniqueSlug(base, slugExistsInNews, exceptId);
}
function toDTO(row) {
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        content: row.content,
        imageUrl: row.imageUrl,
        status: row.status,
        publishedAt: row.publishedAt,
        createdBy: row.createdBy,
        updatedBy: row.updatedBy,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}
// ── GET /api/admin/news ───────────────────────────────────────────────────────
export async function listNewsController(req, res, next) {
    try {
        const { limit, offset } = parsePagination(req.query);
        const [items, total] = await Promise.all([
            listNews({ limit, offset }),
            countNews(),
        ]);
        res.json({ total, limit, offset, items: items.map(toDTO) });
    }
    catch (err) {
        next(err);
    }
}
// ── GET /api/admin/news/:id ───────────────────────────────────────────────────
export async function getNewsController(req, res, next) {
    try {
        const id = parseUuidParam(req.params.id);
        const item = await findNewsById(id);
        if (!item)
            throw new AppError(404, 'Noticia no encontrada.');
        res.json({ item: toDTO(item) });
    }
    catch (err) {
        next(err);
    }
}
// ── POST /api/admin/news ──────────────────────────────────────────────────────
export async function createNewsController(req, res, next) {
    try {
        const actor = req.session.user;
        const parsed = createNewsSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                message: 'Datos inválidos.',
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { title, excerpt, content, imageUrl, publishedAt } = parsed.data;
        // Slug: usar el enviado por el cliente (validado) o generarlo automáticamente.
        const rawSlug = parsed.data.slug ?? slugify(title);
        const finalSlug = (await slugExistsInNews(rawSlug))
            ? await uniqueSlug(title)
            : rawSlug;
        const item = await createNews({
            title,
            slug: finalSlug,
            excerpt,
            content,
            imageUrl: imageUrl ?? '',
            status: publishedAt ? 'published' : 'draft',
            publishedAt: publishedAt ? new Date(publishedAt) : null,
            createdBy: actor.id,
        });
        void createAuditLog({
            userId: actor.id,
            action: 'news_created',
            entityType: 'news',
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
// ── PATCH /api/admin/news/:id ─────────────────────────────────────────────────
export async function updateNewsController(req, res, next) {
    try {
        const actor = req.session.user;
        const id = parseUuidParam(req.params.id);
        const existing = await findNewsById(id);
        if (!existing)
            throw new AppError(404, 'Noticia no encontrada.');
        const parsed = updateNewsSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                message: 'Datos inválidos.',
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const data = parsed.data;
        // Validar unicidad del slug si se está cambiando
        if (data.slug !== undefined && data.slug !== existing.slug) {
            if (await slugExistsInNews(data.slug, id)) {
                throw new AppError(409, `El slug '${data.slug}' ya está en uso.`);
            }
        }
        // Si se envía un título nuevo pero no slug, regenerar slug único
        if (data.title !== undefined && data.slug === undefined) {
            const proposed = slugify(data.title);
            if (proposed !== existing.slug && (await slugExistsInNews(proposed, id))) {
                data.slug = await uniqueSlug(data.title, id);
            }
            else if (proposed !== existing.slug) {
                data.slug = proposed;
            }
        }
        // Derivar status de publishedAt si se envía
        const { publishedAt: pubAtStr, ...restData } = data;
        const updateInput = {
            ...restData,
            updatedBy: actor.id,
        };
        if ('publishedAt' in data) {
            updateInput.publishedAt = pubAtStr ? new Date(pubAtStr) : null;
            updateInput.status = pubAtStr ? 'published' : 'draft';
        }
        const updated = await updateNews(id, updateInput);
        if (!updated)
            throw new AppError(404, 'Noticia no encontrada.');
        void createAuditLog({
            userId: actor.id,
            action: 'news_updated',
            entityType: 'news',
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
// ── DELETE /api/admin/news/:id ────────────────────────────────────────────────
export async function deleteNewsController(req, res, next) {
    try {
        const actor = req.session.user;
        const id = parseUuidParam(req.params.id);
        const existing = await findNewsById(id);
        if (!existing)
            throw new AppError(404, 'Noticia no encontrada.');
        // Confirmación lógica: el cliente debe enviar { confirm: true }
        if (req.body?.confirm !== true) {
            throw new AppError(400, 'Debes confirmar la eliminación enviando { "confirm": true } en el cuerpo.');
        }
        await deleteNews(id);
        void createAuditLog({
            userId: actor.id,
            action: 'news_deleted',
            entityType: 'news',
            entityId: id,
            details: { title: existing.title, slug: existing.slug },
            ipAddress: req.ip ?? null,
            userAgent: req.headers['user-agent'] ?? null,
        });
        res.json({ message: 'Noticia eliminada correctamente.' });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=news.controller.js.map