import { AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmModalProps {
  open:          boolean
  title:         string
  description?:  string
  confirmLabel?: string
  loading?:      boolean
  onConfirm:     () => void
  onCancel:      () => void
  variant?:      'danger' | 'warning'
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  loading = false,
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div
          className={cn(
            'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full',
            variant === 'danger' ? 'bg-red-100' : 'bg-amber-100',
          )}
        >
          <AlertTriangle
            size={22}
            className={variant === 'danger' ? 'text-red-600' : 'text-amber-600'}
          />
        </div>

        <h3 className="text-center font-heading text-lg font-bold text-[--ink-900]">{title}</h3>
        {description && (
          <p className="mt-2 text-center text-sm text-[--ink-600]">{description}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-[--line] px-4 py-2.5 text-sm font-semibold text-[--ink-800] hover:bg-[--soft-blue] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60',
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700',
            )}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
