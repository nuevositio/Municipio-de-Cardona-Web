import { Link } from 'react-router-dom'

import { SEO } from '@/components/seo'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <section className="mx-auto mt-12 max-w-xl rounded-3xl border border-[--line] bg-white p-10 text-center shadow-sm">
      <SEO
        title="404"
        description="La pagina solicitada no fue encontrada en el sitio del Municipio de Cardona."
      />
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[--brand-blue]">Error 404</p>
      <h1 className="mt-2 font-heading text-3xl text-[--ink-900]">Pagina no encontrada</h1>
      <p className="mt-3 text-[--ink-700]">
        La direccion ingresada no existe o fue movida. Puedes volver al inicio y continuar navegando.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Volver al inicio</Link>
      </Button>
    </section>
  )
}
