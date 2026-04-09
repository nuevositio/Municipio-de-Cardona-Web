import { Router } from 'express'
import { requireAuth } from '../middlewares/require-auth.js'
import { requireRole } from '../middlewares/require-auth.js'
import {
  listUsersController,
  getUserController,
  createUserController,
  updateUserController,
  resetPasswordController,
  deleteUserController,
} from '../controllers/users.controller.js'

export const usersRouter = Router()

// Todas las rutas de usuarios requieren:
// 1. Sesión activa (requireAuth)
// 2. Rol superadmin (requireRole) — un admin nunca puede gestionar usuarios
usersRouter.use(requireAuth, requireRole('superadmin'))

// GET    /api/admin/users          → listar todos los usuarios
usersRouter.get('/', listUsersController)

// GET    /api/admin/users/:id      → ver un usuario
usersRouter.get('/:id', getUserController)

// POST   /api/admin/users          → crear usuario
usersRouter.post('/', createUserController)

// PATCH  /api/admin/users/:id      → editar email, rol o estado
usersRouter.patch('/:id', updateUserController)

// PATCH  /api/admin/users/:id/reset-password → cambiar contraseña
usersRouter.patch('/:id/reset-password', resetPasswordController)

// DELETE /api/admin/users/:id      → eliminar (soft delete)
usersRouter.delete('/:id', deleteUserController)
