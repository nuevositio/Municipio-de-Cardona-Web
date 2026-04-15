import { Router } from 'express';
import { requireAuth } from '../middlewares/require-auth.js';
import { listMinutesController, getMinuteController, createMinuteController, updateMinuteController, deleteMinuteController, } from '../controllers/minutes.controller.js';
export const minutesRouter = Router();
// Todas las rutas de actas requieren sesión activa.
// Roles permitidos: superadmin, admin, editor (cualquier usuario autenticado).
minutesRouter.use(requireAuth);
// ── GET /api/admin/minutes ────────────────────────────────────────────────────
// Query params opcionales: ?limit=20&offset=0
minutesRouter.get('/', listMinutesController);
// ── POST /api/admin/minutes ───────────────────────────────────────────────────
minutesRouter.post('/', createMinuteController);
// ── GET /api/admin/minutes/:id ────────────────────────────────────────────────
minutesRouter.get('/:id', getMinuteController);
// ── PATCH /api/admin/minutes/:id ──────────────────────────────────────────────
minutesRouter.patch('/:id', updateMinuteController);
// ── DELETE /api/admin/minutes/:id ─────────────────────────────────────────────
// Requiere body: { "confirm": true }
minutesRouter.delete('/:id', deleteMinuteController);
//# sourceMappingURL=minutes.js.map