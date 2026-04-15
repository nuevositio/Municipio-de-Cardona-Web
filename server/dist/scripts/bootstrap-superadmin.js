/**
 * Bootstrap superadmin
 * ─────────────────────────────────────────────────────────────────────────────
 * Crea el usuario superadmin inicial de forma segura.
 * Solo se ejecuta una vez; es idempotente si el usuario ya existe.
 *
 * Uso:
 *   npm run bootstrap
 *
 * Variables de entorno requeridas (en .env o en el entorno del sistema):
 *   DATABASE_URL         — URL de conexión a Neon PostgreSQL
 *   SUPERADMIN_USERNAME  — nombre de usuario único
 *   SUPERADMIN_EMAIL     — dirección de correo única
 *   SUPERADMIN_PASSWORD  — contraseña en texto plano (se hashea con Argon2id)
 */
import 'dotenv/config';
import argon2 from 'argon2';
import { z } from 'zod';
import { getDb } from '../db/connection.js';
import { users } from '../db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';
import { findUserByUsername, findUserByEmail, createUser } from '../models/user.model.js';
// ── Validación de variables de entorno ────────────────────────────────────────
const envSchema = z.object({
    SUPERADMIN_USERNAME: z
        .string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(64)
        .regex(/^[a-zA-Z0-9_.-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones bajos, puntos y guiones'),
    SUPERADMIN_EMAIL: z
        .string()
        .email('SUPERADMIN_EMAIL debe ser una dirección de correo válida'),
    SUPERADMIN_PASSWORD: z
        .string()
        .min(12, 'La contraseña debe tener al menos 12 caracteres')
        .max(128),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('\n[bootstrap] Variables de entorno inválidas o ausentes:\n');
    const errors = parsed.error.flatten().fieldErrors;
    for (const [key, messages] of Object.entries(errors)) {
        console.error(`  ✖  ${key}: ${messages?.join(', ')}`);
    }
    console.error('\nDefine las variables SUPERADMIN_USERNAME, SUPERADMIN_EMAIL y SUPERADMIN_PASSWORD en tu .env\n');
    process.exit(1);
}
const { SUPERADMIN_USERNAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = parsed.data;
// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function bootstrap() {
    console.log('\n[bootstrap] Iniciando...\n');
    const db = getDb();
    // ── Verificar si ya existe por username ───────────────────────────────────
    const existingByUsername = await findUserByUsername(SUPERADMIN_USERNAME);
    if (existingByUsername) {
        if (existingByUsername.role === 'superadmin') {
            console.log(`[bootstrap] ✔  El superadmin "${SUPERADMIN_USERNAME}" ya existe. No se realizaron cambios.\n`);
        }
        else {
            console.warn(`[bootstrap] ⚠  El username "${SUPERADMIN_USERNAME}" ya está registrado con role "${existingByUsername.role}". No se modificó.\n`);
        }
        process.exit(0);
    }
    // ── Verificar si ya existe por email ──────────────────────────────────────
    const existingByEmail = await findUserByEmail(SUPERADMIN_EMAIL);
    if (existingByEmail) {
        console.warn(`[bootstrap] ⚠  El email "${SUPERADMIN_EMAIL}" ya está registrado para el usuario "${existingByEmail.username}". No se realizaron cambios.\n`);
        process.exit(0);
    }
    // ── Verificar si ya hay algún superadmin en el sistema ───────────────────
    const [existingSuperadmin] = await db
        .select({ id: users.id, username: users.username })
        .from(users)
        .where(and(eq(users.role, 'superadmin'), isNull(users.deletedAt)))
        .limit(1);
    if (existingSuperadmin) {
        console.warn(`[bootstrap] ⚠  Ya existe un superadmin en el sistema: "${existingSuperadmin.username}" (id=${existingSuperadmin.id}).\n` +
            `            No se realizaron cambios.\n`);
        process.exit(0);
    }
    // ── Hashear la contraseña con Argon2id ────────────────────────────────────
    console.log('[bootstrap] Generando hash Argon2id...');
    const passwordHash = await argon2.hash(SUPERADMIN_PASSWORD, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
    });
    // ── Crear el usuario ──────────────────────────────────────────────────────
    const user = await createUser({
        username: SUPERADMIN_USERNAME,
        email: SUPERADMIN_EMAIL,
        passwordHash,
        role: 'superadmin',
        mustChangePassword: false,
    });
    console.log('\n[bootstrap] ✔  Superadmin creado exitosamente:\n');
    console.log(`  ID:       ${user.id}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Email:    ${user.email}`);
    console.log(`  Role:     ${user.role}`);
    console.log('\n  ⚠  Elimina SUPERADMIN_PASSWORD de tu .env o entorno ahora que el usuario fue creado.\n');
}
try {
    await bootstrap();
}
catch (error) {
    console.error('\n[bootstrap] Error inesperado:', error);
    process.exit(1);
}
//# sourceMappingURL=bootstrap-superadmin.js.map