/**
 * Script de utilidad: genera el hash bcrypt del password del administrador.
 *
 * Uso:
 *   npx tsx server/src/scripts/generate-hash.ts <tu-password>
 *
 * Copia el hash resultante en tu .env como ADMIN_PASSWORD_HASH.
 */
import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('Uso: npx tsx server/src/scripts/generate-hash.ts <password>')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)

console.log('\n✓ Hash generado. Copia la siguiente línea en tu .env:\n')
console.log(`ADMIN_PASSWORD_HASH=${hash}`)
console.log()
