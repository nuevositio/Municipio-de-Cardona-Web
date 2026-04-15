import type { Request, Response, NextFunction } from 'express';
/**
 * Error operacional conocido: se devuelve directamente al cliente.
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    constructor(statusCode: number, message: string);
}
/**
 * Manejador global de errores de Express.
 * Debe registrarse como el último middleware de la app.
 */
export declare function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void;
