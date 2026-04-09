import { Router } from 'express'
import { authRouter }        from './auth.js'
import { newsRouter }        from './news.js'
import { minutesRouter }     from './minutes.js'
import { resolutionsRouter } from './resolutions.js'
import { publicRouter }      from './public.js'
import { uploadRouter }      from './upload.js'
import { usersRouter }       from './users.js'

export const router = Router()

// ── Rutas públicas (sin autenticación) ────────────────────────────────────────
router.use('/', publicRouter)

// Autenticación (login, logout, me)
router.use('/admin/auth',        authRouter)

// Upload de archivos (imágenes y PDFs)
router.use('/admin/upload',      uploadRouter)

// Contenido (accesible por superadmin y admin)
router.use('/admin/news',        newsRouter)
router.use('/admin/minutes',     minutesRouter)
router.use('/admin/resolutions', resolutionsRouter)

// Gestión de usuarios (solo superadmin)
router.use('/admin/users',       usersRouter)
