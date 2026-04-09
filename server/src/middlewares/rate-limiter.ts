import { rateLimit } from 'express-rate-limit'

/**
 * Limita los intentos de login a 10 por IP cada 15 minutos.
 * Previene ataques de fuerza bruta contra el panel admin.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: 'Demasiados intentos de acceso. Intenta nuevamente en 15 minutos.',
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})
