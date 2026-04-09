import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="mt-16" style={{ backgroundColor: '#4a4a4a', color: '#fff' }}>
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">

        {/* Identidad */}
        <section>
          <img
            src="/images/logo-horizontal.png"
            alt="Logo del Municipio"
            className="h-14 w-auto object-contain"
          />
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Gestión cercana, transparente y orientada al bienestar de toda la comunidad.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center justify-center rounded-lg p-2 transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center rounded-lg p-2 transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
            >
              <Instagram size={16} />
            </a>
          </div>
        </section>

        {/* Contacto */}
        <section>
          <h2 className="font-heading text-base font-semibold uppercase tracking-widest text-white/50">
            Contacto
          </h2>
          <ul className="mt-4 space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.82)' }}>
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-white/50" />
              Av. Principal s/n, tu localidad
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="shrink-0 text-white/50" />
              Tu teléfono
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="shrink-0 text-white/50" />
              contacto@tumunicip.io
            </li>
          </ul>
        </section>

        {/* Navegación */}
        <section>
          <h2 className="font-heading text-base font-semibold uppercase tracking-widest text-white/50">
            Navegación
          </h2>
          <ul className="mt-4 space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.82)' }}>
            {[
              { to: '/noticias', label: 'Noticias' },
              { to: '/tramites', label: 'Trámites' },
              { to: '/cultura', label: 'Cultura' },
              { to: '/teatro', label: 'Teatro' },
              { to: '/atencion-ciudadana', label: 'Atención Ciudadana' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="inline-block transition-colors hover:text-white"
                  style={{ color: 'inherit' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Pie de página */}
      <div
        className="py-4 text-center text-xs leading-relaxed"
        style={{ borderTop: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(0,0,0,0.18)', color: 'rgba(255,255,255,0.55)' }}
      >
        <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>MILOCAPP</span>
        {' — webapp para gobiernos locales · Producto desarrollado por '}
        <a
          href="https://www.sergioperez.uy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-white"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Sergio Pérez
        </a>
        {' · Prohibida la reproducción total o parcial de estos contenidos.'}
      </div>
    </footer>
  )
}
