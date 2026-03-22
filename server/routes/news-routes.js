import fs from 'node:fs'
import path from 'node:path'
import { Router } from 'express'
import multer from 'multer'

import { deleteNewsById, insertNews, queryAll, queryOne, updateNewsById } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { slugify } from '../utils/slugify.js'

const router = Router()

function normalizeNewsPayload(payload = {}) {
  return {
    title: String(payload.title ?? '').trim(),
    slug: String(payload.slug ?? '').trim(),
    excerpt: String(payload.excerpt ?? '').trim(),
    content: String(payload.content ?? '').trim(),
    date: String(payload.date ?? '').trim(),
  }
}

function validatePayload(payload, hasImage) {
  if (!payload.title || !payload.excerpt || !payload.content || !payload.date) {
    return 'Completa todos los campos requeridos.'
  }

  if (!hasImage) {
    return 'La imagen destacada es obligatoria.'
  }

  return null
}

async function slugExists(slug, exceptId) {
  const row = await queryOne(
    `SELECT id FROM news WHERE slug = ? ${exceptId ? 'AND id != ?' : ''}`,
    exceptId ? [slug, exceptId] : [slug],
  )

  return Boolean(row)
}

function removeImage(imagePath) {
  if (!imagePath) {
    return
  }

  const normalizedPath = imagePath.replace(/^\//, '')
  const absolutePath = path.resolve(process.cwd(), normalizedPath)

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath)
  }
}

router.get('/', async (_req, res, next) => {
  try {
    const rows = await queryAll(`SELECT * FROM news ORDER BY date DESC, createdAt DESC`)
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

router.get('/:slug', async (req, res, next) => {
  try {
    const row = await queryOne(`SELECT * FROM news WHERE slug = ?`, [req.params.slug])

    if (!row) {
      res.status(404).json({ message: 'Noticia no encontrada.' })
      return
    }

    res.json(row)
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const payload = normalizeNewsPayload(req.body)
    const slug = slugify(payload.slug || payload.title)
    const image = req.file ? `/uploads/${req.file.filename}` : ''

    const validationError = validatePayload(payload, Boolean(image))
    if (validationError) {
      removeImage(image)
      res.status(400).json({ message: validationError })
      return
    }

    if (!slug) {
      removeImage(image)
      res.status(400).json({ message: 'El slug no puede quedar vacio.' })
      return
    }

    if (await slugExists(slug)) {
      removeImage(image)
      res.status(409).json({ message: 'Ya existe una noticia con ese slug.' })
      return
    }

    const id = await insertNews({ ...payload, slug, image })
    const created = await queryOne(`SELECT * FROM news WHERE id = ?`, [id])

    res.status(201).json(created)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'ID invalido.' })
      return
    }

    const existing = await queryOne(`SELECT * FROM news WHERE id = ?`, [id])

    if (!existing) {
      if (req.file) {
        removeImage(`/uploads/${req.file.filename}`)
      }
      res.status(404).json({ message: 'Noticia no encontrada.' })
      return
    }

    const payload = normalizeNewsPayload(req.body)
    const slug = slugify(payload.slug || payload.title)
    const newImage = req.file ? `/uploads/${req.file.filename}` : existing.image

    if (!slug) {
      if (req.file) {
        removeImage(`/uploads/${req.file.filename}`)
      }
      res.status(400).json({ message: 'El slug no puede quedar vacio.' })
      return
    }

    if (await slugExists(slug, id)) {
      if (req.file) {
        removeImage(`/uploads/${req.file.filename}`)
      }
      res.status(409).json({ message: 'Ya existe una noticia con ese slug.' })
      return
    }

    const validationError = validatePayload(payload, Boolean(newImage))
    if (validationError) {
      if (req.file) {
        removeImage(`/uploads/${req.file.filename}`)
      }
      res.status(400).json({ message: validationError })
      return
    }

    await updateNewsById(id, {
      ...payload,
      slug,
      image: newImage,
    })

    if (req.file && existing.image) {
      removeImage(existing.image)
    }

    const updated = await queryOne(`SELECT * FROM news WHERE id = ?`, [id])
    res.json(updated)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'ID invalido.' })
      return
    }

    const existing = await queryOne(`SELECT * FROM news WHERE id = ?`, [id])

    if (!existing) {
      res.status(404).json({ message: 'Noticia no encontrada.' })
      return
    }

    await deleteNewsById(id)
    removeImage(existing.image)

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

router.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ message: 'La imagen no puede superar 1 MB.' })
    return
  }

  if (error instanceof Error) {
    res.status(400).json({ message: error.message })
    return
  }

  next(error)
})

export { router as newsRoutes }
