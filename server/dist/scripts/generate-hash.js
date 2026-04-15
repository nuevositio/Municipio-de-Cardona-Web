/**
 * Script de utilidad: genera el hash Argon2id del password del administrador.
 *
 * Uso:
 *   npx tsx server/src/scripts/generate-hash.ts <tu-password>
 *
 * Copia el hash resultante en tu .env como ADMIN_PASSWORD_HASH.
 */
import argon2 from 'argon2';
const password = process.argv[2];
if (!password) {
    console.error('Uso: npx tsx server/src/scripts/generate-hash.ts <password>');
    process.exit(1);
}
const hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB — costo mínimo recomendado por OWASP
    timeCost: 3,
    parallelism: 4,
});
console.log('\n✓ Hash generado. Copia la siguiente línea en tu .env:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log();
//# sourceMappingURL=generate-hash.js.map