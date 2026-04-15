import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  // ── Entorno ────────────────────────────────────────────────────────────────
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // ── Servidor ───────────────────────────────────────────────────────────────
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),

  // ── Sesión ─────────────────────────────────────────────────────────────────
  SESSION_SECRET: z
    .string()
    .min(32, 'SESSION_SECRET debe tener al menos 32 caracteres'),

  // ── Base de datos — Neon (PostgreSQL) ──────────────────────────────────────
  // Se usa @neondatabase/serverless que maneja pooling automáticamente.
  // DATABASE_URL     = connection string con pooling (para queries normales)
  // DIRECT_URL       = connection string directo (para migraciones con Drizzle)
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerida'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL es requerida').optional(),

  // ── Supabase Storage ───────────────────────────────────────────────────────
  SUPABASE_URL: z.string().url('SUPABASE_URL debe ser una URL válida'),
  SUPABASE_SERVICE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_KEY es requerida'),

  // ── Bootstrap inicial ─────────────────────────────────────────────────────
  // Variables opcionales: si están definidas al arrancar, se crea el superadmin
  // automáticamente si no existe ningún admin. Son idempotentes.
  SUPERADMIN_USERNAME: z.string().optional(),
  SUPERADMIN_EMAIL: z.string().email().optional(),
  SUPERADMIN_PASSWORD: z.string().min(12).optional(),

  // ── Cloudflare Turnstile ──────────────────────────────────────────────────
  // En desarrollo se usa la clave de test oficial de Cloudflare (siempre pasa).
  // En producción: https://dash.cloudflare.com/
  CLOUDFLARE_TURNSTILE_SECRET: z
    .string()
    .default('1x0000000000000000000000000000000AA'),
})

const result = schema.safeParse(process.env)

if (!result.success) {
  console.error('\n[env] Variables de entorno inválidas:\n')
  const errors = result.error.flatten().fieldErrors
  for (const [key, messages] of Object.entries(errors)) {
    console.error(`  ${key}: ${messages?.join(', ')}`)
  }
  console.error('\nRevisa tu archivo .env o las variables del sistema.\n')
  process.exit(1)
}

export const env = result.data
