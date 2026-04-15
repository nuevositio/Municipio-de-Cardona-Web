/**
 * Cliente Drizzle ORM sobre Neon (PostgreSQL serverless).
 *
 * - En producción / preview usa @neondatabase/serverless con HTTP pooling.
 * - El cliente es singleton: se inicializa una vez y se reutiliza.
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
let _db = null;
export function getDb() {
    if (!_db) {
        throw new Error('La base de datos no ha sido inicializada. Llama a initializeDb() primero.');
    }
    return _db;
}
export function initializeDb() {
    const sql = neon(env.DATABASE_URL);
    _db = drizzle(sql, { schema, logger: env.NODE_ENV === 'development' });
    logger.info('Drizzle/Neon conectado.');
}
// Mantiene compatibilidad con llamadas a closeDb() en el shutdown handler.
// Con Neon HTTP no hay conexión persistente que cerrar.
export function closeDb() {
    _db = null;
    logger.info('Cliente Drizzle liberado.');
}
//# sourceMappingURL=connection.js.map