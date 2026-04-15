import bcrypt from 'bcryptjs';
import { findUserByUsername, incrementFailedAttempts, lockUserUntil, resetFailedAttempts, } from '../models/user.model.js';
// Número de intentos fallidos antes de bloquear la cuenta
const MAX_FAILED_ATTEMPTS = 5;
// Duración del bloqueo: 15 minutos
const LOCK_DURATION_MS = 15 * 60 * 1000;
/**
 * Verifica credenciales y aplica política de bloqueo por intentos fallidos.
 * No lanza excepciones controladas — devuelve un discriminated union.
 */
export async function verifyLogin(username, password) {
    const user = await findUserByUsername(username);
    // Respuesta uniforme para usuario inexistente y contraseña incorrecta:
    // evita enumerar usuarios válidos mediante timing o mensajes distintos.
    if (!user) {
        await bcrypt.hash('dummy-password-to-normalize-timing', 10);
        return { ok: false, reason: 'not_found' };
    }
    if (!user.isActive) {
        return { ok: false, reason: 'inactive' };
    }
    // Verificar bloqueo temporal
    if (user.lockedUntil && user.lockedUntil > new Date()) {
        return { ok: false, reason: 'locked' };
    }
    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
        await incrementFailedAttempts(user.id);
        const updated = await findUserByUsername(username);
        if (updated && (updated.failedLoginAttempts ?? 0) >= MAX_FAILED_ATTEMPTS) {
            await lockUserUntil(user.id, new Date(Date.now() + LOCK_DURATION_MS));
        }
        return { ok: false, reason: 'bad_password' };
    }
    // Login exitoso: reiniciar contador y registrar last_login_at
    await resetFailedAttempts(user.id);
    return { ok: true, user };
}
//# sourceMappingURL=auth.service.js.map