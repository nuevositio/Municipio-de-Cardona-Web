// ── requireAuth ───────────────────────────────────────────────────────────────
/**
 * Verifica que exista una sesión activa.
 * Devuelve 401 si no hay usuario en sesión.
 */
export function requireAuth(req, res, next) {
    if (!req.session.user) {
        res.status(401).json({ message: 'No autenticado.' });
        return;
    }
    next();
}
// ── requireRole ───────────────────────────────────────────────────────────────
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
export function requireRole(...roles) {
    return (req, res, next) => {
        const user = req.session.user;
        if (!user) {
            res.status(401).json({ message: 'No autenticado.' });
            return;
        }
        if (!roles.includes(user.role)) {
            res.status(403).json({
                message: 'No tienes permisos para realizar esta acción.',
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=require-auth.js.map