import { useEffect, useState } from 'react'
import { Download, FileText } from 'lucide-react'

import { type ApiCouncilMinute, getCouncilMinuteFileUrl, getPublicCouncilMinutes } from '@/lib/council-minutes-api'
import { formatDate } from '@/lib/utils'

export function CouncilMinutesSection() {
  const [minutes, setMinutes] = useState<ApiCouncilMinute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPublicCouncilMinutes()
      .then(setMinutes)
      .catch(() => setError('No se pudieron cargar las actas.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mt-14" aria-labelledby="council-minutes-title">
      <h2 id="council-minutes-title" className="font-heading text-2xl text-[--ink-900] md:text-3xl">
        Actas del Concejo
      </h2>
      <p className="mt-2 max-w-3xl text-[--ink-700]">
        Documentos oficiales de sesiones ordinarias y extraordinarias del Concejo Municipal.
      </p>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-[--ink-700]">Cargando actas...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : minutes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[--line] bg-[--soft-gray] p-6 text-sm text-[--ink-700]">
            Aun no hay actas publicadas.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {minutes.map((item) => (
              <li key={item.id} className="flex flex-col rounded-2xl border border-[--line] bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="mb-3 grid h-10 w-10 place-content-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
                  <FileText size={18} />
                </div>
                <h3 className="font-heading text-lg leading-snug text-[--ink-900]">{item.title}</h3>
                {item.description ? (
                  <p className="mt-1 flex-1 text-sm text-[--ink-700]">{item.description}</p>
                ) : null}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-[--ink-600]">{formatDate(item.date)}</span>
                  <a
                    href={getCouncilMinuteFileUrl(item.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[--brand-blue] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[--brand-blue-700]"
                  >
                    <Download size={13} />
                    Descargar
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
