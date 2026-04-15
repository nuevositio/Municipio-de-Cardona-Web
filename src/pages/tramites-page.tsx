import {
  BookOpen,
  CalendarClock,
  Car,
  CheckCircle2,
  CreditCard,
  FileCheck,
  Heart,
  Landmark,
  Megaphone,
  Music,
  Palette,
  Phone,
  Recycle,
  Sprout,
  UtensilsCrossed,
  Users,
} from 'lucide-react'

import { PageHero } from '@/components/page-hero'
import { SEO } from '@/components/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const puncRequirements = [
  'Fotocopia de cédula',
  'Fotocopia credencial de Soriano',
  'Timbre valor $44',
  'Certificado de domicilio (Comisaría de Soriano)',
  'Carné de salud (solo licencias profesionales)',
  'Prueba psicofísica — mayores de 75 años y licencias profesionales',
  'Certificado médico municipal',
]

const procedures = [
  {
    id: 'proc-1',
    icon: Heart,
    title: 'Servicio Civil',
    description: 'Casamientos, nacimientos, reconocimientos y fallecimientos.',
  },
  {
    id: 'proc-2',
    icon: FileCheck,
    title: 'Certificado Único Departamental',
    description: 'Solicitud del Certificado Único Departamental.',
  },
  {
    id: 'proc-3',
    icon: UtensilsCrossed,
    title: 'Carnet de Manipulación de Alimentos',
    description: 'Solicitud del carnet habilitante para manipulación de alimentos.',
  },
  {
    id: 'proc-4',
    icon: Car,
    title: 'Tránsito',
    description: 'Empadronamientos y transferencias de vehículos.',
  },
  {
    id: 'proc-5',
    icon: BookOpen,
    title: 'Biblioteca Municipal Juana de Ibarbourou',
    description: 'Servicios, catálogo y horarios de la Biblioteca Municipal.',
  },
  {
    id: 'proc-6',
    icon: Users,
    title: 'Oficina de Asuntos Sociales y Familia',
    description: 'Atención y gestiones sociales para vecinos y familias.',
  },
  {
    id: 'proc-7',
    icon: Sprout,
    title: 'Oficina de Promoción y Desarrollo',
    description: 'Programas de desarrollo productivo y social para la comunidad.',
  },
  {
    id: 'proc-8',
    icon: Palette,
    title: 'Casa de la Cultura',
    description: 'Actividades culturales, talleres y eventos de la Casa de la Cultura.',
  },
  {
    id: 'proc-9',
    icon: Music,
    title: 'Conservatorio',
    description: 'Inscripciones, cursos y actividades del Conservatorio Municipal.',
  },
  {
    id: 'proc-10',
    icon: Landmark,
    title: 'Necrópolis',
    description: 'Gestiones y servicios relacionados al cementerio municipal.',
  },
]

export function TramitesPage() {
  return (
    <>
      <SEO
        title="Trámites"
        description="Información y accesos a trámites municipales del Municipio de Cardona."
      />
      <PageHero
        title="Trámites municipales"
        description="Iniciá tus gestiones de manera clara y ordenada. Este listado organiza los trámites más frecuentes y sus requisitos principales."
      />

      {/* ── PUNC DESTACADO ── */}
      <section className="mt-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-9 w-9 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
            <CreditCard size={18} />
          </span>
          <h2 className="text-xl font-semibold text-[--ink-900]">
            PUNC — Permiso Único Nacional de Conducir
          </h2>
        </div>

        <div className="grid gap-4 rounded-2xl border border-[--soft-blue] bg-[--soft-blue]/30 p-4 md:grid-cols-3">

          {/* Requisitos */}
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FileCheck size={16} className="text-[--brand-blue]" />
              <p className="font-semibold text-[--ink-900]">Requisitos</p>
            </div>
            <ul className="space-y-2">
              {puncRequirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm text-[--ink-700]">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[--brand-blue]" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Agenda previa */}
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock size={16} className="text-[--brand-blue]" />
              <p className="font-semibold text-[--ink-900]">Con agenda previa</p>
            </div>
            <div className="space-y-3 text-sm text-[--ink-700]">
              <div>
                <p className="mb-0.5 font-medium text-[--ink-900]">Teórico</p>
                <p>
                  Inscribite en{' '}
                  <a
                    href="https://www.sucive.gub.uy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[--brand-blue] underline underline-offset-2 hover:opacity-80"
                  >
                    www.sucive.gub.uy
                  </a>
                  {' '}— Documentos › Guía Nacional de Conducción › Autos y Motos / Profesional.
                </p>
              </div>
              <div>
                <p className="mb-0.5 font-medium text-[--ink-900]">Práctico</p>
                <p>Vehículo para la prueba al día y acompañante con libreta.</p>
              </div>
            </div>
          </div>

          {/* Horarios y contacto */}
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Phone size={16} className="text-[--brand-blue]" />
              <p className="font-semibold text-[--ink-900]">Horarios del Médico Municipal</p>
            </div>
            <p className="mb-2 text-xs text-[--ink-600]">Para la expedición del Certificado Médico Municipal (requisito PUNC):</p>
            <ul className="mb-4 space-y-1.5 text-sm text-[--ink-700]">
              <li className="flex justify-between">
                <span className="font-medium">Lunes</span>
                <span>9 hs.</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Martes</span>
                <span>15 hs.</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Miércoles</span>
                <span>7 hs.</span>
              </li>
            </ul>
            <p className="text-sm text-[--ink-700]">
              Teléfono:{' '}
              <a
                href="tel:+59845369004"
                className="font-medium text-[--brand-blue] hover:opacity-80"
              >
                4536-9004
              </a>{' '}
              int. 6024
            </p>
          </div>

        </div>
      </section>

      {/* ── PGR DESTACADO ── */}
      <section className="mt-10">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-9 w-9 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
            <Recycle size={18} />
          </span>
          <h2 className="text-xl font-semibold text-[--ink-900]">
            PGR — Plan de Gestión de Residuos
          </h2>
        </div>

        <div className="rounded-2xl border border-[--soft-blue] bg-[--soft-blue]/30 p-4">
          <div className="grid gap-6 md:grid-cols-[1fr_auto]">

            {/* Texto informativo */}
            <div className="space-y-4">
              <div className="flex items-start gap-2 rounded-lg bg-[--brand-blue]/10 px-3 py-2">
                <Megaphone size={15} className="mt-0.5 shrink-0 text-[--brand-blue]" />
                <p className="text-xs font-medium text-[--brand-blue]">
                  Municipio te comunica · Cardona, 15 de abril de 2026
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-semibold text-[--ink-900]">
                  Convocatoria abierta para sumarse al PGR
                </h3>
                <p className="text-sm text-[--ink-700]">
                  El Municipio de Cardona invita a vecinas y vecinos a integrarse activamente al
                  Plan de Gestión de Residuos, una iniciativa orientada a mejorar la gestión
                  ambiental de la ciudad a través de la participación comunitaria.
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[--brand-blue]" />
                  <p className="font-semibold text-[--ink-900]">¿Cómo participar?</p>
                </div>
                <p className="text-sm text-[--ink-700]">
                  Accedé a la información y completá el relevamiento correspondiente ingresando a
                  las redes oficiales del Municipio de Cardona en{' '}
                  <strong>Facebook e Instagram</strong>, o escaneando el código QR.
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <Recycle size={15} className="text-[--brand-blue]" />
                  <p className="font-semibold text-[--ink-900]">¿Para qué sirve?</p>
                </div>
                <p className="text-sm text-[--ink-700]">
                  El PGR permite conocer la realidad de cada hogar en relación a la generación y
                  tratamiento de residuos, constituyendo una herramienta clave para el diseño de
                  políticas públicas más eficientes y sostenibles, avanzando hacia una ciudad más
                  limpia, ordenada y comprometida con el cuidado del ambiente.
                </p>
              </div>
            </div>

            {/* Imagen / QR */}
            <div className="flex items-start justify-center">
              <img
                src="/images/pgr-convocatoria.png"
                alt="Flyer PGR con código QR — Municipio de Cardona"
                className="w-full max-w-[260px] rounded-xl shadow-md"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── RESTO DE TRÁMITES ── */}
      <section className="mt-10">
        <h2 className="mb-5 text-xl font-semibold text-[--ink-900]">Otros trámites</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {procedures.map((procedure) => {
            const Icon = procedure.icon
            return (
              <Card key={procedure.id}>
                <CardHeader>
                  <span className="grid h-10 w-10 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
                    <Icon size={18} />
                  </span>
                  <CardTitle>{procedure.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[--ink-700]">{procedure.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </>
  )
}
