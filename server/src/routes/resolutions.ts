import { Router } from 'express'
import { requireAuth } from '../middlewares/require-auth.js'
import {
  listResolutionsController,
  getResolutionController,
  createResolutionController,
  updateResolutionController,
  deleteResolutionController,
} from '../controllers/resolutions.controller.js'

export const resolutionsRouter = Router()

// Todas las rutas de resoluciones requieren sesión activa.
// Roles permitidos: superadmin, admin, editor (cualquier usuario autenticado).
resolutionsRouter.use(requireAuth)

// ── GET /api/admin/resolutions ────────────────────────────────────────────────
// Query params opcionales: ?limit=20&offset=0
resolutionsRouter.get('/', listResolutionsController)

// ── POST /api/admin/resolutions ───────────────────────────────────────────────
resolutionsRouter.post('/', createResolutionController)

// ── GET /api/admin/resolutions/:id ───────────────────────────────────────────
resolutionsRouter.get('/:id', getResolutionController)

// ── PATCH /api/admin/resolutions/:id ─────────────────────────────────────────
resolutionsRouter.patch('/:id', updateResolutionController)

// ── DELETE /api/admin/resolutions/:id ────────────────────────────────────────
// Requiere body: { "confirm": true }
resolutionsRouter.delete('/:id', deleteResolutionController)
