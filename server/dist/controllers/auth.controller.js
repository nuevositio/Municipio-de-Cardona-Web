import { loginSchema } from '../validators/index.js';
import { verifyLogin } from '../services/auth.service.js';
import { verifyCaptchaToken } from '../services/captcha.service.js';
import { createAuditLog } from '../models/audit-log.model.js';
// ── POST /api/admin/auth/login ────────────────────────────────────────────────
export async function loginController(req, res, next) {
    try {
        // Validación de entrada con Zod
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                message: 'Datos de acceso inválidos.',
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { username, password, captchaToken } = parsed.data;
        // Verificar CAPTCHA antes de consultar la base de datos
        const captchaOk = await verifyCaptchaToken(captchaToken, req.ip);
        if (!captchaOk) {
            res.status(400).json({
                message: 'La verificación CAPTCHA no es válida. Recarga la página e inténtalo nuevamente.',
            });
            return;
        }
        const result = await verifyLogin(username, password);
        if (!result.ok) {
            // Fire-and-forget — no bloqueamos la respuesta por el log
            void createAuditLog({
                userId: null,
                action: 'login_failed',
                entityType: 'auth',
                details: { reason: result.reason, username },
                ipAddress: req.ip ?? null,
                userAgent: req.headers['user-agent'] ?? null,
            });
            // Mensaje genérico — no distingue entre usuario inexistente y contraseña incorrecta
            const message = result.reason === 'locked'
                ? 'Cuenta bloqueada temporalmente. Intenta nuevamente en 15 minutos.'
                : result.reason === 'inactive'
                    ? 'Tu cuenta no está activa. Contacta al administrador.'
                    : 'Usuario o contraseña incorrectos.';
            res.status(401).json({ message });
            return;
        }
        const { user } = result;
        // Regenerar el ID de sesión antes de escribir datos sensibles (previene session fixation)
        req.session.regenerate((err) => {
            if (err) {
                next(err);
                return;
            }
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role,
            };
            void createAuditLog({
                userId: user.id,
                action: 'login',
                entityType: 'auth',
                ipAddress: req.ip ?? null,
                userAgent: req.headers['user-agent'] ?? null,
            });
            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    mustChangePassword: user.mustChangePassword,
                },
            });
        });
    }
    catch (error) {
        next(error);
    }
}
// ── POST /api/admin/auth/logout ───────────────────────────────────────────────
export function logoutController(req, res, next) {
    const sessionUser = req.session.user;
    req.session.destroy((err) => {
        if (err) {
            next(err);
            return;
        }
        if (sessionUser) {
            void createAuditLog({
                userId: sessionUser.id,
                action: 'logout',
                entityType: 'auth',
                ipAddress: req.ip ?? null,
                userAgent: req.headers['user-agent'] ?? null,
            });
        }
        // Elimina la cookie del navegador
        res.clearCookie('milocapp.sid');
        res.json({ message: 'Sesión cerrada correctamente.' });
    });
}
// ── GET /api/admin/auth/me ────────────────────────────────────────────────────
export function meController(req, res) {
    // requireAuth ya garantiza que req.session.user existe al llegar aquí
    const user = req.session.user;
    res.json({
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
        },
    });
}
//# sourceMappingURL=auth.controller.js.map