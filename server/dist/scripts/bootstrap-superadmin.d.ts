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
