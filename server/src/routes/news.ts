import { Router } from 'express'
import { requireAuth } from '../middlewares/require-auth.js'
import {
  listNewsController,
  getNewsController,
  createNewsController,
  updateNewsController,
  deleteNewsController,
} from '../controllers/news.controller.js'

export const newsRouter = Router()

// Todas las rutas de noticias requieren sesión activa.
// Roles permitidos: superadmin, admin, editor (cualquier usuario autenticado).
newsRouter.use(requireAuth)

// ── GET /api/admin/news ───────────────────────────────────────────────────────
// Query params opcionales: ?limit=20&offset=0
newsRouter.get('/', listNewsController)

// ── POST /api/admin/news ──────────────────────────────────────────────────────
newsRouter.post('/', createNewsController)

// ── GET /api/admin/news/:id ───────────────────────────────────────────────────
newsRouter.get('/:id', getNewsController)

// ── PATCH /api/admin/news/:id ─────────────────────────────────────────────────
newsRouter.patch('/:id', updateNewsController)

// ── DELETE /api/admin/news/:id ────────────────────────────────────────────────
// Requiere body: { "confirm": true }
newsRouter.delete('/:id', deleteNewsController)

