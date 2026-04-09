import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  publishedAt: string | null
}

export function StatusBadge({ publishedAt }: StatusBadgeProps) {
  if (!publishedAt) {
    return (
      <span className="inline-flex items-center rounded-full bg-[--soft-gray] px-2.5 py-0.5 text-xs font-medium text-[--ink-600]">
        Borrador
      </span>
    )
  }

  const scheduled = new Date(publishedAt) > new Date()

  if (scheduled) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        Programado
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-[--soft-green] px-2.5 py-0.5 text-xs font-medium',
        'text-[--brand-green]',
      )}
    >
      Publicado
    </span>
  )
}
