import fs from 'node:fs'
import path from 'node:path'
import { Router } from 'express'

import {
  deleteCouncilMinuteById,
  insertCouncilMinute,
  queryAll,
  queryOne,
  updateCouncilMinuteById,
} from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { uploadPdf } from '../middleware/upload.js'

const router = Router()

function normalizePayload(body = {}) {
  return {
    title: String(body.title ?? '').trim(),
    date: String(body.date ?? '').trim(),
    description: String(body.description ?? '').trim(),
  }
}

function removeFile(filePath) {
  if (!filePath) return
  const normalized = filePath.replace(/^\//, '')
  const absolute = path.resolve(process.cwd(), normalized)
  if (fs.existsSync(absolute)) fs.unlinkSync(absolute)
}

// GET /api/council-minutes — público
router.get('/', async (_req, res, next) => {
  try {
    const rows = await queryAll(
      `SELECT * FROM council_minutes ORDER BY date DESC, createdAt DESC`,
    )
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

// POST /api/council-minutes — autenticado
router.post('/', requireAuth, uploadPdf.single('file'), async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body)
    const file = req.file ? `/uploads/${req.file.filename}` : ''

    if (!payload.title || !payload.date || !file) {
      removeFile(file)
      res.status(400).json({ message: 'Titulo, fecha y archivo PDF son obligatorios.' })
      return
    }

    const id = await insertCouncilMinute({ ...payload, file })
    const created = await queryOne(`SELECT * FROM council_minutes WHERE id = ?`, [id])
    res.status(201).json(created)
  } catch (error) {
    next(error)
  }
})

// PUT /api/council-minutes/:id — autenticado
router.put('/:id', requireAuth, uploadPdf.single('file'), async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'ID invalido.' })
      return
    }

    const existing = await queryOne(`SELECT * FROM council_minutes WHERE id = ?`, [id])
    if (!existing) {
      if (req.file) removeFile(`/uploads/${req.file.filename}`)
      res.status(404).json({ message: 'Acta no encontrada.' })
      return
    }

    const payload = normalizePayload(req.body)
    const newFile = req.file ? `/uploads/${req.file.filename}` : existing.file

    if (!payload.title || !payload.date) {
      if (req.file) removeFile(`/uploads/${req.file.filename}`)
      res.status(400).json({ message: 'Titulo y fecha son obligatorios.' })
      return
    }

    if (req.file && existing.file) removeFile(existing.file)

    await updateCouncilMinuteById(id, { ...payload, file: newFile })
    const updated = await queryOne(`SELECT * FROM council_minutes WHERE id = ?`, [id])
    res.json(updated)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/council-minutes/:id — autenticado
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'ID invalido.' })
      return
    }

    const existing = await queryOne(`SELECT * FROM council_minutes WHERE id = ?`, [id])
    if (!existing) {
      res.status(404).json({ message: 'Acta no encontrada.' })
      return
    }

    await deleteCouncilMinuteById(id)
    removeFile(existing.file)
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export { router as councilMinutesRoutes }
