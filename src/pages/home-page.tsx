import { Link } from 'react-router-dom'

import { SEO } from '@/components/seo'
import { Button } from '@/components/ui/button'
import { AuthoritiesSection } from '@/sections/authorities-section'
import { CouncilMinutesSection } from '@/sections/council-minutes-section'
import { HeroSlider } from '@/sections/hero-slider'
import { TransparencySection } from '@/sections/transparency-section'

export function HomePage() {
  return (
    <>
      <SEO
        title="Inicio"
        description="Sitio oficial del Municipio de Cardona con noticias, tramites, transparencia y servicios para la ciudadania."
      />

      <HeroSlider />

      <section className="mt-14 rounded-3xl border border-[--line] bg-[--soft-gray] p-8 md:p-10">
        <h2 className="font-heading text-2xl text-[--ink-900] md:text-3xl">
          Gestion al servicio de la comunidad
        </h2>
        <p className="mt-3 max-w-3xl text-[--ink-700]">
          Accede de forma clara a tramites, novedades y canales de atencion para resolver tus consultas en menos tiempo.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/tramites">Ver tramites</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/atencion-ciudadana">Atencion ciudadana</Link>
          </Button>
        </div>
      </section>

      <AuthoritiesSection />
      <CouncilMinutesSection />
      <TransparencySection />
    </>
  )
}
