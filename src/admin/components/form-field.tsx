import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label:     string
  error?:    string
  required?: boolean
  children:  ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[--ink-800]">
        {label}
        {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}

/** Clases Tailwind para inputs estándar del panel admin. */
// eslint-disable-next-line react-refresh/only-export-components
export const inputCls = (hasError?: boolean) =>
  cn(
    'w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-[--ink-900]',
    'outline-none transition placeholder:text-[--ink-600]',
    'focus:border-[--brand-blue] focus:ring-2 focus:ring-[--brand-blue]/20',
    hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-[--line]',
  )
