/**
 * Middleware de upload refactorizado para Supabase Storage.
 *
 * En lugar de guardar en disco local, usa multer con memoryStorage
 * para capturar el buffer en memoria y luego delegarlo al storage.service.
 *
 * El handler final de cada ruta es responsable de llamar a
 * uploadImage() o uploadDocument() del storage.service.
 */
import multer, { type FileFilterCallback } from 'multer'
import type { Request } from 'express'
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_PDF_TYPES,
  MAX_IMAGE_SIZE,
  MAX_PDF_SIZE,
} from '../services/storage.service.js'

// ── Storage en memoria (sin escritura a disco) ────────────────────────────────

const memoryStorage = multer.memoryStorage()

// ── Filtros MIME ──────────────────────────────────────────────────────────────

function imageFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP.'))
  }
}

function pdfFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (ALLOWED_PDF_TYPES.has(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos PDF.'))
  }
}

// ── Instancias exportadas ─────────────────────────────────────────────────────

export const uploadImage = multer({
  storage:    memoryStorage,
  fileFilter: imageFilter,
  limits:     { fileSize: MAX_IMAGE_SIZE },
}).single('file')

export const uploadPdf = multer({
  storage:    memoryStorage,
  fileFilter: pdfFilter,
  limits:     { fileSize: MAX_PDF_SIZE },
}).single('file')
