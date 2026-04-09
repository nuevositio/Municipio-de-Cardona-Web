import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { navItems } from '@/data/navigation'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/20 text-white backdrop-blur-sm"
      style={{ backgroundColor: '#4a4a4a' }}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Ir al inicio">
          <img
            src="/icono.png"
            alt="Logo del Municipio"
            className="h-11 w-11 rounded-xl object-contain"
          />
          <div>
            <p className="font-heading text-base leading-none text-white md:text-lg">
              Tu Municipio
            </p>
            <p className="text-xs text-white/75 md:text-sm">Gobierno local</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegacion principal">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-700)]'
                      : 'text-white/90 hover:bg-white/15 hover:text-white',
                  )
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/login"
            className="hidden items-center gap-1.5 rounded-xl border border-white/30 px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/15 hover:text-white lg:inline-flex"
            aria-label="Acceso administrador"
          >
            <Lock size={13} />
            Admin
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white lg:hidden"
            aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/20 text-white lg:hidden"
            style={{ backgroundColor: '#2e2e2e' }}
          >
            <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Navegacion mobile">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium',
                        isActive
                          ? 'bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-700)]'
                          : 'text-white/90 hover:bg-white/15',
                      )
                    }
                  >
                    <Icon size={17} />
                    {item.label}
                  </NavLink>
                )
              })}
              <NavLink
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium',
                    isActive
                      ? 'bg-[var(--brand-green)] text-white'
                      : 'text-white/70 hover:bg-white/10',
                  )
                }
              >
                <Lock size={17} />
                Acceso Admin
              </NavLink>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
