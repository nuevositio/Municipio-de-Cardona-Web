import { type FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { getAdminToken, setAdminToken } from '@/lib/auth-storage'
import { loginAdmin } from '@/lib/news-api'

export function AdminLoginPage() {
  const token = getAdminToken()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (token) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const result = await loginAdmin(username.trim(), password)
      setAdminToken(result.token)
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin'
      navigate(redirectTo, { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo iniciar sesion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-3xl border border-[--line] bg-white/90 p-8 shadow-xl shadow-[rgba(15,76,129,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[--brand-green]">Acceso privado</p>
        <h1 className="mt-2 font-heading text-3xl text-[--ink-900]">Panel de noticias</h1>
        <p className="mt-2 text-sm text-[--ink-700]">
          Ingresa con las credenciales de administrador para gestionar publicaciones.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[--ink-800]">Usuario</span>
            <input
              className="w-full rounded-xl border border-[--line] bg-white px-4 py-3 text-[--ink-800] outline-none transition focus:border-[--brand-blue]"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[--ink-800]">Contrasena</span>
            <input
              type="password"
              className="w-full rounded-xl border border-[--line] bg-white px-4 py-3 text-[--ink-800] outline-none transition focus:border-[--brand-blue]"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-[--brand-blue] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[--brand-blue-700] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesion'}
          </button>
        </form>
      </section>
    </main>
  )
}
