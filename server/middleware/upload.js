import fs from 'node:fs'
import path from 'node:path'
import multer from 'multer'

const uploadsPath = path.resolve(process.cwd(), 'uploads')

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxFileSize = 1024 * 1024

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsPath)
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase()
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`
    callback(null, uniqueName)
  },
})

function fileFilter(_req, file, callback) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(new Error('Solo se permiten imagenes JPG, JPEG, PNG o WEBP.'))
    return
  }
  callback(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSize },
})

export const imageRules = {
  maxFileSize,
  allowedMimeTypes,
}

// ── PDF upload ────────────────────────────────────────────────────
const allowedPdfMimeTypes = ['application/pdf']
const maxPdfSize = 10 * 1024 * 1024 // 10 MB

function pdfFileFilter(_req, file, callback) {
  if (!allowedPdfMimeTypes.includes(file.mimetype)) {
    callback(new Error('Solo se permiten archivos PDF.'))
    return
  }
  callback(null, true)
}

export const uploadPdf = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: maxPdfSize },
})
