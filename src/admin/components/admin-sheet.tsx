import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AdminSheetProps {
  open:     boolean
  onClose:  () => void
  title:    string
  children: ReactNode
  width?:   string
}

export function AdminSheet({
  open,
  onClose,
  title,
  children,
  width = 'w-full sm:w-[480px]',
}: AdminSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div
        className={cn(
          'relative flex h-full flex-col bg-white shadow-2xl',
          width,
          'max-w-full',
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[--line] px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-[--ink-900]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[--ink-600] hover:bg-[--soft-blue]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  )
}
