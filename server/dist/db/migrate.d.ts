/**
 * Runner de migraciones Drizzle.
 *
 * Usa la conexión directa (DIRECT_URL) en lugar del pool de Neon,
 * ya que las migraciones DDL requieren una conexión PostgreSQL estándar.
 *
 * Ejecutar con:  npm run db:migrate
 */
import 'dotenv/config';
