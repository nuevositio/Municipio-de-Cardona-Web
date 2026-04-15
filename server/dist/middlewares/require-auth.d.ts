import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../types/index.js';
/**
 * Verifica que exista una sesión activa.
 * Devuelve 401 si no hay usuario en sesión.
 */
export declare function requireAuth(req: Request, res: Response, next: NextFunction): void;
/**
 * Fábrica de middleware que restringe el acceso según rol.
 *
 * Jerarquía:
 *   superadmin → puede hacer todo lo que puede un admin, y además gestionar usuarios.
 *   admin      → solo puede gestionar contenido.
 *
 * Uso en rutas:
 *   router.use(requireAuth)
 *   router.use(requireRole('superadmin'))   // solo superadmin
 *
 * Siempre se usa DESPUÉS de requireAuth, nunca solo.
 */
export declare function requireRole(...roles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
