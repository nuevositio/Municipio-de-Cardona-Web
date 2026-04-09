import type { ElementType, ReactNode } from 'react'
import { FileQuestion } from 'lucide-react'

interface EmptyStateProps {
  title:        string
  description?: string
  action?:      ReactNode
  icon?:        ElementType
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = FileQuestion,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon className="mb-4 h-10 w-10 text-[--ink-600]" aria-hidden="true" />
      <h3 className="font-heading text-lg font-bold text-[--ink-900]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-xs text-sm text-[--ink-600]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
