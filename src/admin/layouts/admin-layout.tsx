import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  ScrollText,
  X,
} from 'lucide-react'
import { useAuth } from '../hooks/use-auth.js'
import { cn } from '@/lib/utils'

// ── Navegación ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: '/admin/dashboard',    label: 'Inicio',       icon: LayoutDashboard },
  { to: '/admin/noticias',     label: 'Noticias',     icon: Newspaper },
  { to: '/admin/actas',        label: 'Actas',        icon: FileText },
  { to: '/admin/resoluciones', label: 'Resoluciones', icon: ScrollText },
] as const

// ── Componente ────────────────────────────────────────────────────────────────

export function AdminLayout() {
  const { user, logout }     = useAuth()
  const navigate             = useNavigate()
  const [open, setOpen]      = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-[--surface]">
      {/* ── Overlay móvil ────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-[--line] bg-white transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:translate-x-0',
        )}
      >
        {/* Logo / cabecera */}
        <div className="flex items-center gap-3 border-b border-[--line] px-5 py-4">
          <img
            src="/images/logo_municipio.webp"
            alt="Logo Municipio"
            className="h-9 w-9 rounded-full object-contain border border-[--line]"
          />
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-bold text-[--ink-900]">
              Panel Admin
            </p>
            <p className="truncate text-xs text-[--ink-600]">{user?.username}</p>
          </div>
          {/* Cerrar en móvil */}
          <button
            className="ml-auto rounded-lg p-1 text-[--ink-600] hover:bg-[--soft-blue] lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[--soft-blue] text-[--ink-900]'
                          : 'text-[--ink-700] hover:bg-[--soft-blue] hover:text-[--ink-900]',
                      )
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    {label}
                  </NavLink>
                </li>
            ))}
          </ul>
        </nav>

        {/* Pie del sidebar */}
        <div className="border-t border-[--line] px-3 py-3">
          <div className="mb-2 rounded-xl px-3 py-2">
            <p className="text-xs font-medium text-[--ink-600]">Sesión activa</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-[--ink-900]">
              {user?.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[--ink-700] transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Área principal ───────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header móvil */}
        <header className="flex items-center gap-3 border-b border-[--line] bg-white px-4 py-3 lg:hidden">
          <button
            className="rounded-lg p-2 text-[--ink-700] hover:bg-[--soft-blue]"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <span className="font-heading font-bold text-[--ink-900]">Panel Admin</span>
        </header>

        {/* Contenido de la ruta activa */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
