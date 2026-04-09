import helmet from 'helmet'
import cors from 'cors'
import { env } from '../config/env.js'

/**
 * Helmet configura headers HTTP de seguridad:
 * X-Frame-Options, X-Content-Type-Options, HSTS (en producción), etc.
 */
export const helmetMiddleware = helmet({
  // CSP conservador: ajustar según los recursos que cargue el frontend
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false,
})

/**
 * CORS restringido al origin del frontend.
 * credentials: true es necesario para enviar cookies de sesión.
 */
export const corsMiddleware = cors({
  origin: env.FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
})
