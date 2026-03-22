import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { initializeDb } from './db.js'
import { authRoutes } from './routes/auth-routes.js'
import { councilMinutesRoutes } from './routes/council-minutes-routes.js'
import { newsRoutes } from './routes/news-routes.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

const uploadsPath = path.resolve(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}

app.use(
  cors({
    origin: frontendOrigin,
  }),
)
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(uploadsPath))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/council-minutes', councilMinutesRoutes)

app.use((error, _req, res, _next) => {
  // Log interno para depuracion de fallos inesperados en produccion/local.
  // eslint-disable-next-line no-console
  console.error(error)
  res.status(500).json({ message: 'Error interno del servidor.' })
})

initializeDb()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API corriendo en http://localhost:${port}`)
    })
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('No se pudo inicializar SQLite', error)
    process.exit(1)
  })
