import { API_BASE } from '../../lib/api-base.js'

/**
 * Sube una imagen al servidor. Devuelve la URL relativa del archivo subido.
 * @param file  Archivo de imagen (JPG/PNG/WEBP, máx 2 MB)
 */
export async function apiUploadImage(file: File): Promise<string> {
  return uploadFile(`${API_BASE}/api/admin/upload/image`, file)
}

/**
 * Sube un PDF al servidor. Devuelve la URL relativa del archivo subido.
 * @param file  Archivo PDF (máx 5 MB)
 */
export async function apiUploadPdf(file: File): Promise<string> {
  return uploadFile(`${API_BASE}/api/admin/upload/pdf`, file)
}

async function uploadFile(url: string, file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)

  const res = await fetch(url, {
    method:      'POST',
    credentials: 'include',
    body,
  })

  let data: unknown = null
  try {
    data = await res.json()
  } catch {
    // no-op
  }

  if (!res.ok) {
    const message = (data as { message?: string })?.message ?? `Error ${res.status}`
    throw new Error(message)
  }

  return (data as { url: string }).url
}
