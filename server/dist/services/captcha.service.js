import { env } from '../config/env.js';
/**
 * Verifica un token de Cloudflare Turnstile contra la API siteverify.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 *
 * Devuelve `true` si el token es válido; `false` en cualquier otro caso.
 * Falla-cerrado: si la API de Cloudflare no responde, se deniega el acceso.
 */
export async function verifyCaptchaToken(token, remoteip) {
    try {
        const body = new URLSearchParams({
            secret: env.CLOUDFLARE_TURNSTILE_SECRET,
            response: token,
        });
        if (remoteip) {
            body.set('remoteip', remoteip);
        }
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
        if (!res.ok) {
            return false;
        }
        const data = (await res.json());
        return data.success === true;
    }
    catch {
        // Falla-cerrado: error de red → denegar login para proteger el sistema
        return false;
    }
}
//# sourceMappingURL=captcha.service.js.map