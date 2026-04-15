import type { User } from '../types/index.js';
export type LoginResult = {
    ok: true;
    user: User;
} | {
    ok: false;
    reason: 'not_found' | 'inactive' | 'locked' | 'bad_password';
};
/**
 * Verifica credenciales y aplica política de bloqueo por intentos fallidos.
 * No lanza excepciones controladas — devuelve un discriminated union.
 */
export declare function verifyLogin(username: string, password: string): Promise<LoginResult>;
