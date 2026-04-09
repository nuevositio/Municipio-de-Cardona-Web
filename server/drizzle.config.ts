/**
 * Drizzle Kit configuration
 * Genera y aplica las migraciones para Neon (PostgreSQL).
 *
 * Scripts disponibles (definidos en package.json):
 *   npm run db:generate  → genera archivos SQL en server/drizzle/
 *   npm run db:migrate   → aplica migraciones en la base de datos
 *   npm run db:studio    → abre Drizzle Studio localmente
 *   npm run db:push      → push sin archivos de migración (solo desarrollo)
 */
import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DIRECT_URL o DATABASE_URL son requeridas para Drizzle Kit.')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/src/db/schema.ts',
  out: './server/drizzle',
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: true,
})
