type Level = 'info' | 'warn' | 'error'

function log(level: Level, message: string, extra?: unknown): void {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level.toUpperCase().padEnd(5)}]`

  if (level === 'error') {
    console.error(prefix, message, extra !== undefined ? extra : '')
  } else if (level === 'warn') {
    console.warn(prefix, message, extra !== undefined ? extra : '')
  } else {
    console.log(prefix, message, extra !== undefined ? extra : '')
  }
}

export const logger = {
  info: (message: string, extra?: unknown) => log('info', message, extra),
  warn: (message: string, extra?: unknown) => log('warn', message, extra),
  error: (message: string, extra?: unknown) => log('error', message, extra),
}
