import { Router } from 'express';
import { loginRateLimiter } from '../middlewares/rate-limiter.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { loginController, logoutController, meController, } from '../controllers/auth.controller.js';
export const authRouter = Router();
// POST /api/admin/auth/login
// Rate limit aplicado solo a este endpoint para no penalizar el resto de la API
authRouter.post('/login', loginRateLimiter, loginController);
// POST /api/admin/auth/logout
// Requiere sesión activa — logout sin sesión no tiene sentido
authRouter.post('/logout', requireAuth, logoutController);
// GET /api/admin/auth/me
// Útil para que el frontend verifique si la sesión sigue activa al recargar
authRouter.get('/me', requireAuth, meController);
//# sourceMappingURL=auth.js.map