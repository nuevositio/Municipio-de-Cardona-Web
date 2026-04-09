import { useEffect, useState } from 'react'
import { Download, FileText, Loader2 } from 'lucide-react'

import { PageHero } from '@/components/page-hero'
import { type ApiCouncilMinute, getCouncilMinuteFileUrl, getPublicCouncilMinutes } from '@/lib/council-minutes-api'
import { formatDate } from '@/lib/utils'

export function CouncilMinutesPage() {
  const [minutes, setMinutes] = useState<ApiCouncilMinute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getPublicCouncilMinutes()
      .then((data) => setMinutes(data.sort((a, b) =>
        (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt),
      )))
      .catch(() => setError('No se pudieron cargar las actas.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHero
        title="Actas del Concejo"
        description="Documentos oficiales de sesiones ordinarias y extraordinarias del Concejo Municipal."
      />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[--ink-600]" size={28} />
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        {!loading && !error && minutes.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[--line] bg-[--soft-gray] p-8 text-center text-sm text-[--ink-700]">
            Aún no hay actas publicadas.
          </p>
        )}

        {!loading && minutes.length > 0 && (
          <ol className="space-y-3">
            {minutes.map((item, index) => (
              <li key={item.id}>
                <div className="flex items-center gap-4 rounded-2xl border border-[--line] bg-white px-5 py-4 shadow-sm transition hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[--soft-blue] text-[--brand-blue]">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-semibold leading-snug text-[--ink-900]">
                      <span className="mr-2 text-sm font-normal text-[--ink-500]">#{minutes.length - index}</span>
                      {item.title}
                    </p>
                    {item.summary && (
                      <p className="mt-0.5 truncate text-sm text-[--ink-600]">{item.summary}</p>
                    )}
                    <p className="mt-1 text-xs text-[--ink-500]">
                      {formatDate(item.publishedAt ?? item.createdAt)}
                    </p>
                  </div>
                  <a
                    href={getCouncilMinuteFileUrl(item.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[--brand-blue] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    <Download size={13} />
                    Descargar
                  </a>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  )
}
