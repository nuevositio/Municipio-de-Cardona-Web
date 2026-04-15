import cors from 'cors';
/**
 * Helmet configura headers HTTP de seguridad:
 * X-Frame-Options, X-Content-Type-Options, HSTS (en producción), etc.
 */
export declare const helmetMiddleware: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
/**
 * CORS restringido al origin del frontend.
 * credentials: true es necesario para enviar cookies de sesión.
 */
export declare const corsMiddleware: (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
