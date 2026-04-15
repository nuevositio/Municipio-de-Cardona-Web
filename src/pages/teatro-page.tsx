import { CheckCircle2, Clapperboard, ClipboardList, ExternalLink, FileText, Ticket, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { PageHero } from '@/components/page-hero'
import { SEO } from '@/components/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const theatreItems = [
  {
    id: 'tea-1',
    icon: Clapperboard,
    title: 'Temporada teatral 2026',
    description: 'Obras regionales y nacionales con funciones semanales en el Teatro Municipal.',
    requirements: null,
  },
  {
    id: 'tea-2',
    icon: Ticket,
    title: 'Entradas y reservas',
    description: 'Sistema presencial de reservas con cupos para estudiantes y adultos mayores.',
    requirements: null,
  },
  {
    id: 'tea-3',
    icon: ClipboardList,
    title: 'Requisitos para alquiler de sala',
    description: null,
    requirements: [
      'Nota de solicitud dirigida al Municipio de Cardona',
      'Fotocopia de cédula de identidad del responsable',
      'Descripción detallada del evento o actividad',
      'Pago del arancel correspondiente',
      'Habilitación municipal vigente (si aplica)',
      'El solicitante asume responsabilidad por daños al espacio',
      'Prohibido el ingreso de alimentos y bebidas al escenario',
    ],
  },
]

const TIPO_USO = [
  'Espectáculo artístico / musical',
  'Obra de teatro',
  'Evento cultural',
  'Conferencia / charla',
  'Actividad educativa',
  'Evento social / comunitario',
  'Otro',
]

function SolicitudForm() {
  const [enviado, setEnviado] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    organizacion: '',
    tipoUso: '',
    fecha: '',
    horario: '',
    descripcion: '',
    aceptaCondiciones: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="rounded-xl border border-[--brand-green] bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-[--brand-green]">¡Solicitud enviada!</p>
        <p className="mt-1 text-sm text-[--ink-700]">
          Nos pondremos en contacto a la brevedad para confirmar la disponibilidad.
        </p>
        <button
          onClick={() => setEnviado(false)}
          className="mt-4 text-sm font-medium text-[--brand-blue] underline-offset-4 hover:underline"
        >
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
      {/* Nombre */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[--ink-800]" htmlFor="nombre">
          Nombre y apellido <span className="text-red-500">*</span>
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej.: María González"
          className="rounded-lg border border-[--ink-300] bg-white px-3 py-2 text-sm outline-none focus:border-[--brand-blue] focus:ring-2 focus:ring-[--brand-blue]/20"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[--ink-800]" htmlFor="email">
          Correo electrónico <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          className="rounded-lg border border-[--ink-300] bg-white px-3 py-2 text-sm outline-none focus:border-[--brand-blue] focus:ring-2 focus:ring-[--brand-blue]/20"
        />
      </div>

      {/* Teléfono */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[--ink-800]" htmlFor="telefono">
          Teléfono de contacto
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Ej.: 099 123 456"
          className="rounded-lg border border-[--ink-300] bg-white px-3 py-2 text-sm outline-none focus:border-[--brand-blue] focus:ring-2 focus:ring-[--brand-blue]/20"
        />
      </div>

      {/* Organización */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[--ink-800]" htmlFor="organizacion">
          Institución / Organización
        </label>
        <input
          id="organizacion"
          name="organizacion"
          type="text"
          value={form.organizacion}
          onChange={handleChange}
          placeholder="Nombre del grupo u organización (opcional)"
          className="rounded-lg border border-[--ink-300] bg-white px-3 py-2 text-sm outline-none focus:border-[--brand-blue] focus:ring-2 focus:ring-[--brand-blue]/20"
        />
      </div>

      {/* Tipo de uso */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[--ink-800]" htmlFor="tipoUso">
          Tipo de uso <span className="text-red-500">*</span>
        </label>
        <select
          id="tipoUso"
          name="tipoUso"
          required
          value={form.tipoUso}
          onChange={handleChange}
          className="rounded-lg border border-[--ink-300] bg-white px-3 py-2 text-sm outline-none focus:border-[--brand-blue] focus:ring-2 focus:ring-[--brand-blue]/20"
        >
          <option value="">Seleccioná una opción</option>
          {TIPO_USO.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Fecha solicitada */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[--ink-800]" htmlFor="fecha">
          Fecha solicitada <span className="text-red-500">*</span>
        </label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          required
          value={form.fecha}
          onChange={handleChange}
          className="rounded-lg border border-[--ink-300] bg-white px-3 py-2 text-sm outline-none focus:border-[--brand-blue] focus:ring-2 focus:ring-[--brand-blue]/20"
        />
      </div>

      {/* Horario */}
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-sm font-medium text-[--ink-800]" htmlFor="horario">
          Horario estimado
        </label>
        <input
          id="horario"
          name="horario"
          type="text"
          value={form.horario}
          onChange={handleChange}
          placeholder="Ej.: 19:00 a 22:00 hs"
          className="rounded-lg border border-[--ink-300] bg-white px-3 py-2 text-sm outline-none focus:border-[--brand-blue] focus:ring-2 focus:ring-[--brand-blue]/20"
        />
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-sm font-medium text-[--ink-800]" htmlFor="descripcion">
          Descripción del evento <span className="text-red-500">*</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          required
          rows={4}
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Describí brevemente el evento o actividad que deseas realizar..."
          className="rounded-lg border border-[--ink-300] bg-white px-3 py-2 text-sm outline-none focus:border-[--brand-blue] focus:ring-2 focus:ring-[--brand-blue]/20"
        />
      </div>

      {/* Condiciones */}
      <div className="flex flex-col gap-3 md:col-span-2">
        <label className="flex items-start gap-2 text-sm text-[--ink-700]">
          <input
            name="aceptaCondiciones"
            type="checkbox"
            required
            checked={form.aceptaCondiciones}
            onChange={handleChange}
            className="mt-0.5 accent-[--brand-blue]"
          />
          Declaro haber leído y acepto las condiciones de uso del Teatro Municipal.
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[--brand-blue] underline-offset-4 hover:underline"
          >
            <ExternalLink size={14} />
            Ver condiciones de uso del Teatro
            <span className="rounded bg-[--soft-blue] px-1.5 py-0.5 text-xs font-semibold text-[--brand-blue]">
              En elaboración
            </span>
          </a>

          <button
            type="submit"
            className="rounded-lg bg-[--brand-blue] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
          >
            Enviar solicitud
          </button>
        </div>
      </div>
    </form>
  )
}

function ReglamentoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-[--ink-200] bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[--ink-900]">Reglamento de uso y arrendamiento</h2>
            <p className="text-sm text-[--ink-600]">Teatro Artigas de Cardona</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-8 w-8 place-content-center rounded-lg text-[--ink-600] transition hover:bg-[--ink-100] hover:text-[--ink-900]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-6 px-6 py-5 text-sm text-[--ink-700]">

          <p>
            El Teatro Artigas de Cardona es un espacio cultural de gran importancia para la comunidad,
            orientado a promover y difundir la cultura en todas sus manifestaciones. El Municipio de
            Cardona ha establecido este reglamento para garantizar su correcto uso y preservación.
          </p>

          {/* Descripción de la sala */}
          <div>
            <h3 className="mb-3 font-semibold text-[--ink-900]">Descripción de la sala</h3>
            <ul className="space-y-2">
              {[
                'Capacidad: 250 butacas numeradas para el público.',
                'Sistema de sonido e iluminación con técnico responsable.',
                'Dos camerinos para artistas y personal técnico.',
                'Baños y duchas disponibles para público y artistas.',
                'Piano Steinways and Sons para uso en eventos musicales.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[--brand-blue]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Condiciones */}
          <div>
            <h3 className="mb-3 font-semibold text-[--ink-900]">Condiciones de arrendamiento</h3>
            <ol className="space-y-3 list-none">
              {[
                { n: '1', t: 'Arrendamiento', d: 'Costo: $U 8.000 por evento. Instituciones educativas: $U 4.000. El pago debe realizarse en su totalidad antes del evento.' },
                { n: '2', t: 'Horarios', d: 'Se establecen según las necesidades del arrendatario y la disponibilidad del teatro.' },
                { n: '3', t: 'Condiciones de uso', d: 'La utilización se realiza bajo supervisión del personal. El arrendatario garantiza que el uso sea acorde a fines culturales.' },
                { n: '4', t: 'Limpieza y conservación', d: 'El arrendatario garantiza la limpieza y conservación del teatro y sus instalaciones. Cualquier daño deberá ser reparado a su cargo.' },
                { n: '5', t: 'Normas de seguridad', d: 'No se permiten elementos pirotécnicos, sustancias inflamables ni objetos que pongan en riesgo la seguridad. Se deben cumplir todas las normas establecidas.' },
                { n: '6', t: 'Responsabilidades', d: 'El arrendatario es responsable de cualquier accidente o daño producido durante el evento y de toda responsabilidad civil o penal derivada.' },
                { n: '7', t: 'Reservas', d: 'Se realizan por correo a rrpp.cardona@soriano.gub.uy indicando: detalle del evento, fecha y hora, responsable, teléfono, correo y si tiene costo de entrada. Con al menos 15 días de anticipación, concurriendo luego a las oficinas del Municipio (sección "Espectáculos públicos y recaudación") para confirmar y abonar.' },
                { n: '8', t: 'Cancelación', d: 'El arrendatario debe notificar al teatro con al menos 96 horas de antelación. Cualquier modificación debe acordarse por escrito.' },
                { n: '9', t: 'Piano', d: 'Solo puede ser utilizado por pianistas profesionales o bajo supervisión de un técnico especializado.' },
                { n: '10', t: 'Solicitud de arrendamiento', d: 'Puede realizarse en el Municipio de Cardona al teléfono 4536 9004 int. 25 o por correo a municipio.cardona@soriano.gub.uy.' },
                { n: '11', t: 'Sellado de eventos', d: 'Si el evento tiene costo de entrada, el organizador debe realizar el trámite de sellado en la sección Recaudación del Municipio con una nota detallando fecha, organizador y detalles del evento.' },
                { n: '12', t: 'Aportes a AGADU', d: 'Los aportes a AGADU corren exclusivamente por cuenta del organizador. El Municipio de Cardona queda excluido de toda responsabilidad en este aspecto.' },
              ].map((item) => (
                <li key={item.n} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[--soft-blue] text-xs font-bold text-[--brand-blue]">
                    {item.n}
                  </span>
                  <span>
                    <span className="font-medium text-[--ink-900]">{item.t}: </span>
                    {item.d}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Penalidades */}
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <h3 className="mb-3 font-semibold text-red-800">Penalidades por daños</h3>
            <ul className="space-y-2 text-red-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 font-bold">•</span>
                <span><strong>Daños leves:</strong> el organizador costea los gastos de reparación.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 font-bold">•</span>
                <span><strong>Daños graves:</strong> el organizador paga la reparación y puede ser negado el acceso al teatro en el futuro.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 font-bold">•</span>
                <span><strong>Daños intencionales o negligentes:</strong> suspensión temporal o definitiva del derecho de uso y posible compensación económica.</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-[--ink-500]">Cardona, abril de 2023</p>
        </div>
      </div>
    </div>
  )
}

export function TeatroPage() {
  const [reglamentoOpen, setReglamentoOpen] = useState(false)

  return (
    <>
      <SEO
        title="Teatro"
        description="Cartelera, actividades y accesos para el usufructo del Teatro Municipal de Cardona."
      />
      <PageHero
        title="Teatro Municipal"
        description="El Teatro Municipal promueve la producción artística local y el acceso ciudadano a propuestas escénicas de calidad."
      />

      {reglamentoOpen && <ReglamentoModal onClose={() => setReglamentoOpen(false)} />}

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {theatreItems.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.id}>
              <CardHeader>
                <span className="grid h-10 w-10 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
                  <Icon size={18} />
                </span>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {item.requirements ? (
                  <>
                    <ul className="mb-4 space-y-2">
                      {item.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2 text-sm text-[--ink-700]">
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[--brand-blue]" />
                          {req}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setReglamentoOpen(true)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[--brand-blue] underline-offset-4 hover:underline"
                    >
                      <FileText size={14} />
                      Ver reglamento completo
                    </button>
                  </>
                ) : (
                  <p className="text-[--ink-700]">{item.description}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Formulario de solicitud */}
      <section className="mt-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
            <FileText size={18} />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-[--ink-900]">
              Solicitud de uso del Teatro Municipal
            </h2>
            <p className="mt-0.5 text-sm text-[--ink-600]">
              Completá el formulario y nos comunicaremos para confirmar disponibilidad.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[--ink-200] bg-white p-6 shadow-sm">
          <SolicitudForm />
        </div>
      </section>
    </>
  )
}
