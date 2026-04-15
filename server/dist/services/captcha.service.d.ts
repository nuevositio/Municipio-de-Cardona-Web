/**
 * Verifica un token de Cloudflare Turnstile contra la API siteverify.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 *
 * Devuelve `true` si el token es válido; `false` en cualquier otro caso.
 * Falla-cerrado: si la API de Cloudflare no responde, se deniega el acceso.
 */
export declare function verifyCaptchaToken(token: string, remoteip?: string): Promise<boolean>;
