import { useEffect } from 'react'

interface AutoRotateOptions {
  enabled?: boolean
  intervalMs?: number
}

export function useAutoRotate(
  callback: () => void,
  { enabled = true, intervalMs = 6500 }: AutoRotateOptions = {},
): void {
  useEffect(() => {
    if (!enabled) return

    const timer = window.setInterval(() => {
      callback()
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [callback, enabled, intervalMs])
}
