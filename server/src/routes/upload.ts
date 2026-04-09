import { Router, type Request, type Response, type NextFunction } from 'express'
import { requireAuth } from '../middlewares/require-auth.js'
import { uploadImage as imageMiddleware, uploadPdf as pdfMiddleware } from '../middlewares/upload.js'
import {
  uploadImage as uploadImageToStorage,
  uploadDocument,
} from '../services/storage.service.js'

export const uploadRouter = Router()

// ── POST /api/admin/upload/image ──────────────────────────────────────────────
// Acepta multipart/form-data con campo "file" (imagen JPG/PNG/WEBP, máx 2 MB).
// Devuelve: { url: "https://…supabase…/news-images/2026/04/…" }
uploadRouter.post(
  '/image',
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    imageMiddleware(req, res, (err) => {
      if (err) {
        res.status(400).json({ message: err.message })
        return
      }
      next()
    })
  },
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: 'No se recibió ningún archivo.' })
      return
    }
    try {
      const result = await uploadImageToStorage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
      )
      res.status(201).json({ url: result.url, path: result.path })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir la imagen.'
      res.status(500).json({ message })
    }
  },
)

// ── POST /api/admin/upload/pdf ────────────────────────────────────────────────
// Acepta multipart/form-data con campo "file" (PDF, máx 10 MB).
// Devuelve: { url: "https://…supabase…/official-docs/2026/04/…" }
uploadRouter.post(
  '/pdf',
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    pdfMiddleware(req, res, (err) => {
      if (err) {
        res.status(400).json({ message: err.message })
        return
      }
      next()
    })
  },
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: 'No se recibió ningún archivo.' })
      return
    }
    try {
      const result = await uploadDocument(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
      )
      res.status(201).json({ url: result.url, path: result.path })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir el documento.'
      res.status(500).json({ message })
    }
  },
)
