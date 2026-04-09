import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, Lock } from 'lucide-react'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useAuth } from '../hooks/use-auth.js'
import { loginSchema, type LoginFormValues } from '../schemas/login.js'
import { cn } from '@/lib/utils'

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string

function LoginForm() {
  const { status, login } = useAuth()
  const navigate          = useNavigate()
  const location          = useLocation()
  const from              = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard'
  const { executeRecaptcha } = useGoogleReCaptcha()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      navigate(from, { replace: true })
    }
  }, [status, navigate, from])

  const onSubmit = useCallback(async (values: LoginFormValues) => {
    if (!executeRecaptcha) {
      setError('root', { message: 'reCAPTCHA aún no está listo. Intenta de nuevo.' })
      return
    }
    try {
      const captchaToken = await executeRecaptcha('admin_login')
      await login(values.username, values.password, captchaToken)
      navigate(from, { replace: true })
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Error al iniciar sesión.',
      })
    }
  }, [executeRecaptcha, login, navigate, from, setError])

  // Spinner mientras se verifica la sesión inicial
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--surface]">
        <Loader2 className="h-8 w-8 animate-spin text-[--brand-blue]" />
      </div>
    )
  }

  if (status === 'authenticated') {
    return <Navigate to={from} replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[--surface] px-4 py-12">
      {/* Decoración de fondo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[--brand-blue] opacity-[0.04]" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[--brand-green] opacity-[0.06]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Cabecera */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[--brand-blue] shadow-lg">
            <Lock size={24} className="text-white" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--brand-green]">
            Acceso privado
          </p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-[--ink-900]">
            Panel administrativo
          </h1>
          <p className="mt-2 text-sm text-[--ink-600]">
            Ingresa con tus credenciales para gestionar el sitio.
          </p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="rounded-2xl border border-[--line] bg-white px-8 py-8 shadow-xl shadow-[rgba(74,74,74,0.10)]">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Campo usuario */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-[--ink-800]"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoFocus
                {...register('username')}
                className={cn(
                  'w-full rounded-xl border bg-white px-4 py-3 text-[--ink-900] outline-none transition',
                  'placeholder:text-[--ink-600]',
                  'focus:border-[--brand-blue] focus:ring-1 focus:ring-[--brand-blue]',
                  errors.username
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
                    : 'border-[--line]',
                )}
                placeholder="nombre de usuario"
              />
              {errors.username && (
                <p className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle size={12} />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Campo contraseña */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[--ink-800]"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className={cn(
                  'w-full rounded-xl border bg-white px-4 py-3 text-[--ink-900] outline-none transition',
                  'placeholder:text-[--ink-600]',
                  'focus:border-[--brand-blue] focus:ring-1 focus:ring-[--brand-blue]',
                  errors.password
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
                    : 'border-[--line]',
                )}
                placeholder="••••••••••••"
              />
              {errors.password && (
                <p className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle size={12} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error de servidor (credenciales incorrectas, CAPTCHA inválido, etc.) */}
            {errors.root && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errors.root.message}</span>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isSubmitting || !executeRecaptcha}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[--brand-blue] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[--brand-blue-700] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Ingresando…
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>

        {/* Pie */}
        <p className="mt-6 text-center text-xs text-[--ink-600]">
          Panel de administración — acceso restringido al personal autorizado.
        </p>
      </div>
    </main>
  )
}

export function AdminLoginPage() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY} language="es">
      <LoginForm />
    </GoogleReCaptchaProvider>
  )
}
