import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiLogin, apiLogout, apiMe } from '../api/auth.js'
import type { AdminUser, AuthStatus } from '../types/index.js'

// ── Tipos del contexto ────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AdminUser | null
  status: AuthStatus
  login: (username: string, password: string, captchaToken: string) => Promise<void>
  logout: () => Promise<void>
}

// ── Contexto ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState<AdminUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  // Verificar sesión activa en cada carga de la app.
  // Si la cookie existe el servidor devuelve el usuario; si no, 401.
  useEffect(() => {
    apiMe()
      .then((u) => {
        setUser(u)
        setStatus('authenticated')
      })
      .catch(() => {
        setUser(null)
        setStatus('unauthenticated')
      })
  }, [])

  const login = useCallback(async (username: string, password: string, captchaToken: string) => {
    const result = await apiLogin(username, password, captchaToken)
    setUser(result.user)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const value = useMemo(
    () => ({ user, status, login, logout }),
    [user, status, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── Hook ──────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  }
  return ctx
}
