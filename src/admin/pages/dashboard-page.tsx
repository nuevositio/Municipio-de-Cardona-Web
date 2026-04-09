import {
  FileText,
  Newspaper,
  ScrollText,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth.js'

interface StatCard {
  label: string
  description: string
  to: string
  icon: React.ElementType
  color: string
}

const STAT_CARDS: StatCard[] = [
  {
    label:       'Noticias',
    description: 'Gestionar publicaciones y artículos del sitio.',
    to:          '/admin/noticias',
    icon:        Newspaper,
    color:       'bg-blue-50 text-blue-700',
  },
  {
    label:       'Actas',
    description: 'Actas de sesiones del concejo municipal.',
    to:          '/admin/actas',
    icon:        FileText,
    color:       'bg-amber-50 text-amber-700',
  },
  {
    label:       'Resoluciones',
    description: 'Resoluciones y disposiciones oficiales.',
    to:          '/admin/resoluciones',
    icon:        ScrollText,
    color:       'bg-green-50 text-green-700',
  },
]

export function DashboardPage() {
  const { user } = useAuth()

  const greeting = getGreeting()

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Cabecera de bienvenida */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[--brand-green]">
          Panel administrativo
        </p>
        <h1 className="mt-1 font-heading text-3xl font-bold text-[--ink-900]">
          {greeting}, {user?.username ?? 'admin'}.
        </h1>
        <p className="mt-2 text-[--ink-600]">
          Desde aquí puedes gestionar los contenidos del sitio municipal.
        </p>
      </div>

      {/* Tarjetas de acceso rápido */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[--ink-600]">
          Módulos de contenido
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STAT_CARDS.map(({ label, description, to, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-3 rounded-2xl border border-[--line] bg-white p-5 shadow-sm transition hover:border-[--brand-blue] hover:shadow-md"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-[--ink-900] group-hover:text-[--brand-blue]">
                  {label}
                </p>
                <p className="mt-0.5 text-sm text-[--ink-600]">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Información de la sesión */}
      <section className="rounded-2xl border border-[--line] bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[--ink-600]">
          Sesión activa
        </h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="font-medium text-[--ink-700]">Usuario:</dt>
            <dd className="text-[--ink-900]">{user?.username}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}
