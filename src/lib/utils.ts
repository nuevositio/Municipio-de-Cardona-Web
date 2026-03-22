import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat('es-UY', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateValue))
}
