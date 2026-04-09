/**
 * Supabase Storage Service
 *
 * Capa de abstracción para todas las operaciones de archivos.
 * Los uploads se envían directamente a Supabase Storage; el backend
 * nunca escribe en disco local.
 *
 * Buckets:
 *   - news-images      → imágenes para noticias (JPEG, PNG, WEBP, máx 2 MB)
 *   - official-docs    → PDFs oficiales: actas y resoluciones (máx 10 MB)
 *
 * Políticas Supabase recomendadas (aplicar en Dashboard):
 *   - news-images:    INSERT para authenticated (service role), SELECT público
 *   - official-docs:  INSERT para authenticated (service role), SELECT público
 */
import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'
import path from 'node:path'
import { env } from '../config/env.js'

// ── Cliente Supabase (service role — solo en el servidor) ─────────────────────

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

// ── Constantes ────────────────────────────────────────────────────────────────

export const BUCKET_IMAGES = 'news-images'
export const BUCKET_DOCS   = 'official-docs'

export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
export const ALLOWED_PDF_TYPES   = new Set(['application/pdf'])

export const MAX_IMAGE_SIZE = 2  * 1024 * 1024  //  2 MB
export const MAX_PDF_SIZE   = 10 * 1024 * 1024  // 10 MB

// ── Helpers internos ──────────────────────────────────────────────────────────

/**
 * Genera una ruta organizada por fecha y un nombre de archivo seguro y único.
 * Ejemplo: 2026/04/a3f2c1b0d48e9021.jpg
 */
function buildStoragePath(originalName: string): string {
  const now  = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const ext  = path.extname(originalName).toLowerCase().replace(/[^a-z0-9.]/g, '') || '.bin'
  const uid  = crypto.randomBytes(16).toString('hex')
  return `${year}/${month}/${uid}${ext}`
}

// ── API pública ───────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string
  path: string
  bucket: string
}

/**
 * Sube una imagen a Supabase Storage (bucket: news-images).
 * Valida MIME type y tamaño antes de enviar.
 */
export async function uploadImage(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  size: number,
): Promise<UploadResult> {
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    throw new Error('Solo se permiten imágenes JPG, PNG o WEBP.')
  }
  if (size > MAX_IMAGE_SIZE) {
    throw new Error('La imagen supera el tamaño máximo de 2 MB.')
  }

  const storagePath = buildStoragePath(originalName)

  const { error } = await supabase.storage
    .from(BUCKET_IMAGES)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
    })

  if (error) throw new Error(`Error al subir imagen: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET_IMAGES).getPublicUrl(storagePath)

  return { url: data.publicUrl, path: storagePath, bucket: BUCKET_IMAGES }
}

/**
 * Sube un PDF a Supabase Storage (bucket: official-docs).
 * Valida MIME type y tamaño antes de enviar.
 */
export async function uploadDocument(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  size: number,
): Promise<UploadResult> {
  if (!ALLOWED_PDF_TYPES.has(mimeType)) {
    throw new Error('Solo se permiten archivos PDF.')
  }
  if (size > MAX_PDF_SIZE) {
    throw new Error('El archivo supera el tamaño máximo de 10 MB.')
  }

  const storagePath = buildStoragePath(originalName)

  const { error } = await supabase.storage
    .from(BUCKET_DOCS)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
    })

  if (error) throw new Error(`Error al subir documento: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET_DOCS).getPublicUrl(storagePath)

  return { url: data.publicUrl, path: storagePath, bucket: BUCKET_DOCS }
}

/**
 * Elimina un archivo de Supabase Storage dado su bucket y path interno.
 * Silencioso si el archivo no existe.
 */
export async function deleteFile(bucket: string, storagePath: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([storagePath])
  if (error) {
    // Log pero no lanzar: no romper el flujo si el archivo ya no existe
    console.warn(`[storage] No se pudo eliminar ${bucket}/${storagePath}: ${error.message}`)
  }
}

/**
 * Genera una URL firmada (temporal) para un archivo privado.
 * Por defecto expira en 1 hora.
 */
export async function getSignedUrl(
  bucket: string,
  storagePath: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresInSeconds)

  if (error || !data?.signedUrl) {
    throw new Error(`No se pudo generar la URL firmada: ${error?.message ?? 'sin datos'}`)
  }

  return data.signedUrl
}
