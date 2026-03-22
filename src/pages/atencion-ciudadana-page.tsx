import { Clock3, HelpCircle, MapPin, PhoneCall } from 'lucide-react'

import { contactPhones } from '@/data/contact-phones'
import { PageHero } from '@/components/page-hero'
import { SEO } from '@/components/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const services = [
  {
    id: 'svc-1',
    icon: PhoneCall,
    title: 'Canales de contacto',
    description: 'Telefono, correo y atencion presencial para consultas y seguimiento de solicitudes.',
  },
  {
    id: 'svc-2',
    icon: Clock3,
    title: 'Horarios de atencion',
    description: 'Lunes a viernes de 08:00 a 14:00 en oficinas del Municipio de Cardona.',
  },
  {
    id: 'svc-3',
    icon: MapPin,
    title: 'Direccion oficial',
    description: 'Lavalleja 1308, Cardona, Soriano, Uruguay.',
  },
]

export function AtencionCiudadanaPage() {
  return (
    <>
      <SEO
        title="Atencion Ciudadana"
        description="Canales de atencion ciudadana y orientacion de tramites del Municipio de Cardona."
      />
      <section id="atencion">
        <PageHero
          title="Atencion Ciudadana"
          description="Estamos para ayudarte. Centralizamos consultas, reclamos y orientacion para que cada tramite sea mas simple y transparente."
        />
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Card key={service.id}>
              <CardHeader>
                <span className="grid h-10 w-10 place-content-center rounded-xl bg-[--soft-green] text-[--brand-green]">
                  <Icon size={18} />
                </span>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[--ink-700]">{service.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="mt-10">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
                <HelpCircle size={18} />
              </span>
              <div>
                <CardTitle>Telefonos e internos</CardTitle>
                <p className="mt-1 text-sm text-[--ink-700]">
                  Guia de contacto por area y seccion del Municipio de Cardona.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-[--line]">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[--brand-blue] text-left text-white">
                    <th className="px-3 py-2 font-semibold">Telefono</th>
                    <th className="px-3 py-2 font-semibold">Area</th>
                    <th className="px-3 py-2 font-semibold">Seccion</th>
                    <th className="px-3 py-2 font-semibold">Interno</th>
                  </tr>
                </thead>
                <tbody>
                  {contactPhones.map((contact, index) => (
                    <tr
                      key={contact.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-[--soft-gray]'}
                    >
                      <td className="whitespace-nowrap px-3 py-2 font-semibold text-[--ink-800]">
                        {contact.telefono}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-[--ink-800]">{contact.area}</td>
                      <td className="px-3 py-2 text-[--ink-800]">{contact.seccion}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-[--ink-800]">{contact.interno}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
