import { env } from './config/env.js';
import { initializeDb, closeDb } from './db/connection.js';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';
import bcrypt from 'bcryptjs';
import { findUserByUsername, findUserByEmail, createUser, } from './models/user.model.js';
import { getDb } from './db/connection.js';
import { users } from './db/schema.js';
import { isNull } from 'drizzle-orm';
// ── Bootstrap automático del superadmin ──────────────────────────────────────
// Si las variables SUPERADMIN_* están definidas, crea el primer superadmin
// al arrancar si no existe ningún usuario admin activo.
// Es idempotente: no hace nada si ya existe algún admin.
async function maybeBootstrap() {
    const { SUPERADMIN_USERNAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = env;
    if (!SUPERADMIN_USERNAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD)
        return;
    // Verificar si ya existe algún usuario con rol admin o superadmin
    const db = getDb();
    const [existingAdmin] = await db
        .select({ id: users.id })
        .from(users)
        .where(isNull(users.deletedAt))
        .limit(1);
    if (existingAdmin) {
        logger.info('Bootstrap: ya existe al menos un usuario, omitiendo.');
        return;
    }
    const [existingUsername] = await Promise.all([
        findUserByUsername(SUPERADMIN_USERNAME),
        findUserByEmail(SUPERADMIN_EMAIL),
    ]);
    if (existingUsername) {
        logger.info('Bootstrap: username o email ya en uso, omitiendo.');
        return;
    }
    const passwordHash = await bcrypt.hash(SUPERADMIN_PASSWORD, 12);
    await createUser({
        username: SUPERADMIN_USERNAME,
        email: SUPERADMIN_EMAIL,
        passwordHash,
        role: 'superadmin',
        mustChangePassword: true,
    });
    logger.info(`Bootstrap: superadmin "${SUPERADMIN_USERNAME}" creado correctamente.`);
}
async function main() {
    initializeDb();
    await maybeBootstrap();
    const app = createApp();
    const server = app.listen(env.PORT, () => {
        logger.info(`API corriendo en http://localhost:${env.PORT} [${env.NODE_ENV}]`);
    });
    const shutdown = () => {
        logger.info('Apagando servidor...');
        server.close(() => {
            closeDb();
            process.exit(0);
        });
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}
main().catch((error) => {
    console.error('Error fatal al iniciar el servidor:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map