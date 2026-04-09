import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth.js'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Envuelve cualquier ruta del panel admin.
 * - Mientras verifica la sesión muestra un spinner ligero.
 * - Sin sesión, redirige a /admin/login guardando la ruta de origen.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuth()
  const location   = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--surface]">
        <div className="flex flex-col items-center gap-3 text-[--ink-600]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[--brand-blue] border-t-transparent" />
          <span className="text-sm">Verificando sesión…</span>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return <>{children}</>
}
