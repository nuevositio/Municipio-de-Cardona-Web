/**
 * Utilidad compartida para todas las peticiones al backend admin.
 * Añade automáticamente credentials (cookie de sesión) y Content-Type JSON.
 */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const isJson = init?.body != null && typeof init.body === 'string'

  const res = await fetch(url, {
    credentials: 'include',
    ...init,
    headers: {
      ...(isJson ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers as Record<string, string> | undefined),
    },
  })

  let data: unknown = null
  try {
    data = await res.json()
  } catch {
    // respuesta sin cuerpo JSON (ej. 204)
  }

  if (!res.ok) {
    const message = (data as { message?: string })?.message ?? `Error ${res.status}`
    throw new Error(message)
  }

  return data as T
}
