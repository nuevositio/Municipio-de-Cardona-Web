import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { navItems } from '@/data/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[--line] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Ir al inicio">
          <img
            src="/images/logo_municipio.webp"
            alt="Logo del Municipio de Cardona"
            className="h-11 w-11 rounded-xl object-cover"
          />
          <div>
            <p className="font-heading text-base leading-none text-[--ink-900] md:text-lg">
              Municipio de Cardona
            </p>
            <p className="text-xs text-[--ink-600] md:text-sm">Gobierno local</p>
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
                      ? 'bg-[--soft-blue] text-[--brand-blue-700]'
                      : 'text-[--ink-700] hover:bg-[--soft-blue] hover:text-[--ink-900]',
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
          <Button asChild className="hidden md:inline-flex">
            <a href="#atencion">Acceso</a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
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
            className="border-t border-[--line] bg-white lg:hidden"
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
                          ? 'bg-[--soft-blue] text-[--brand-blue-700]'
                          : 'text-[--ink-700] hover:bg-[--soft-blue]',
                      )
                    }
                  >
                    <Icon size={17} />
                    {item.label}
                  </NavLink>
                )
              })}
              <Button asChild className="mt-2 w-full">
                <a href="#atencion" onClick={() => setIsOpen(false)}>
                  Acceso
                </a>
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
