import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { helmetMiddleware, corsMiddleware } from './middlewares/security.js'
import { createSessionMiddleware } from './middlewares/session.js'
import { errorHandler } from './middlewares/error-handler.js'
import { router } from './routes/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createApp(): express.Express {
  const app = express()

  // ── Trust proxy ────────────────────────────────────────────────────────────
  // cPanel, Render y Vercel colocan un proxy delante.
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

  // ── Frontend estático (producción) ────────────────────────────────────────
  // En producción, Express sirve el build de Vite (dist/) y redirige cualquier
  // ruta desconocida al index.html para que React Router maneje el historial.
  if (process.env.NODE_ENV === 'production') {
    // server/dist/app.js → subir dos niveles para llegar al dist/ del frontend
    const distPath = path.resolve(__dirname, '../../dist')
    app.use(express.static(distPath, { maxAge: '1y', immutable: true }))
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'))
    })
  }

  // ── Manejador de errores (debe ser el último middleware) ───────────────────
  app.use(errorHandler)

  return app
}
