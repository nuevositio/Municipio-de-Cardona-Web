import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="mt-16" style={{ backgroundColor: 'var(--bg-dark)', color: '#fff' }}>
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">

        {/* Identidad */}
        <section>
          <img
            src="/images/logo_municipio.webp"
            alt="Logo Municipio de Cardona"
            className="h-16 w-16 rounded-full object-contain bg-white p-0.5"
          />
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Gestión cercana, transparente y orientada al bienestar de toda la comunidad.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.facebook.com/cardona.unmunicipioactivo/?locale=es_LA"
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
              href="https://www.instagram.com/municipiodecardona/"
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
              Lavalleja 1308, Cardona — Soriano, Uruguay
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="shrink-0 text-white/50" />
              <a href="tel:+59845369004" className="transition-colors hover:text-white" style={{ color: 'inherit' }}>4536 9004</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="shrink-0 text-white/50" />
              <a href="mailto:municipio.cardona@soriano.gub.uy" className="transition-colors hover:text-white" style={{ color: 'inherit' }}>municipio.cardona@soriano.gub.uy</a>
            </li>
            <li className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/59897961163"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                style={{ backgroundColor: '#25D366', color: '#fff' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.099 1.51 5.829L0 24l6.335-1.486A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.214-3.732.875.946-3.614-.235-.372A9.818 9.818 0 1112 21.818z"/></svg>
                WhatsApp
              </a>
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
        {'Desarrollado por el '}
        <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Municipio de Cardona</span>
        {' · Prohibida la reproducción total o parcial de estos contenidos.'}
      </div>
    </footer>
  )
}
