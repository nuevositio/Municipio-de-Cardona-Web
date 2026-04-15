import { logger } from '../utils/logger.js';
/**
 * Error operacional conocido: se devuelve directamente al cliente.
 */
export class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}
/**
 * Manejador global de errores de Express.
 * Debe registrarse como el último middleware de la app.
 */
export function errorHandler(error, _req, res, _next) {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }
    // Error inesperado: loguearlo sin exponer detalles internos al cliente
    logger.error('Error no controlado', error instanceof Error ? error.stack : String(error));
    res.status(500).json({ message: 'Error interno del servidor.' });
}
//# sourceMappingURL=error-handler.js.map