/**
 * Limita los intentos de login a 10 por IP cada 15 minutos.
 * Previene ataques de fuerza bruta contra el panel admin.
 */
export declare const loginRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Limita las consultas al chatbot IA a 20 mensajes por IP cada 10 minutos.
 * Evita abuso de la API de OpenAI.
 */
export declare const chatRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
