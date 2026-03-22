import { type ReactElement, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { clearAdminToken, getAdminToken } from '@/lib/auth-storage'
import { getAdminSession } from '@/lib/news-api'

interface AdminRouteProps {
  children: ReactElement
}

export function AdminRoute({ children }: AdminRouteProps) {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied'>('loading')

  useEffect(() => {
    const token = getAdminToken()

    if (!token) {
      setStatus('denied')
      return
    }

    getAdminSession()
      .then(() => setStatus('allowed'))
      .catch(() => {
        clearAdminToken()
        setStatus('denied')
      })
  }, [])

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center text-[--ink-700]">
        Verificando sesion...
      </div>
    )
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
