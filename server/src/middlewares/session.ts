/**
 * Middleware de sesión con store en PostgreSQL (connect-pg-simple).
 *
 * Al eliminar connect-sqlite3 toda la sesión se almacena en Neon,
 * lo que hace el backend completamente stateless en disco y compatible
 * con escalado horizontal.
 *
 * La tabla "session" es creada automáticamente por connect-pg-simple
 * si no existe (usa el script interno del paquete).
 */
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import { env } from '../config/env.js'
import type { RequestHandler } from 'express'
import type { SessionUser } from '../types/index.js'

// Augmentación de tipo: agrega el campo `user` a la sesión
declare module 'express-session' {
  interface SessionData {
    user?: SessionUser
  }
}

const PgStore = connectPgSimple(session)

export function createSessionMiddleware(): RequestHandler {
  const store = new PgStore({
    conString: env.DATABASE_URL,
    tableName: 'sessions',
    createTableIfMissing: true,
    // Limpieza periódica de sesiones expiradas (cada hora)
    pruneSessionInterval: 60 * 60,
  })

  return session({
    store,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // En producción el frontend (Vercel) y el backend (Render) son orígenes
      // distintos, por lo que la cookie DEBE ser sameSite:'none' + secure:true.
      // En desarrollo se usa 'lax' para no requerir HTTPS local.
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 horas
    },
    name: 'milocapp.sid',
  }) as RequestHandler
}
