import express from 'express'
import { helmetMiddleware, corsMiddleware } from './middlewares/security.js'
import { createSessionMiddleware } from './middlewares/session.js'
import { errorHandler } from './middlewares/error-handler.js'
import { router } from './routes/index.js'

export function createApp(): express.Express {
  const app = express()

  // ── Trust proxy ────────────────────────────────────────────────────────────
  // Render y Vercel colocan un proxy delante. Sin esto Express no sabe que
  // el request original viene por HTTPS y no envía cookies `secure`.
  app.set('trust proxy', 1)

  // ── Seguridad ──────────────────────────────────────────────────────────────
  app.use(helmetMiddleware)
  app.use(corsMiddleware)

  // ── Body parsing ───────────────────────────────────────────────────────────
  app.use(express.json({ limit: '512kb' }))

  // ── Sesiones (PostgreSQL store via connect-pg-simple) ─────────────────────
  app.use(createSessionMiddleware())

  // ── Health check ───────────────────────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
  })

  // ── Rutas de la API ────────────────────────────────────────────────────────
  app.use('/api', router)

  // ── Manejador de errores (debe ser el último middleware) ───────────────────
  app.use(errorHandler)

  return app
}
