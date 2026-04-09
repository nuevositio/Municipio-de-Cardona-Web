/**
 * Runner de migraciones Drizzle.
 *
 * Usa la conexión directa (DIRECT_URL) en lugar del pool de Neon,
 * ya que las migraciones DDL requieren una conexión PostgreSQL estándar.
 *
 * Ejecutar con:  npm run db:migrate
 */
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  console.error('[migrate] DIRECT_URL o DATABASE_URL son requeridos.')
  process.exit(1)
}

const pool = new Pool({ connectionString, max: 1 })
const db = drizzle(pool)

console.log('[migrate] Aplicando migraciones…')

await migrate(db, {
  migrationsFolder: path.resolve(__dirname, '../../drizzle'),
})

await pool.end()

console.log('[migrate] ✓ Migraciones aplicadas correctamente.')
