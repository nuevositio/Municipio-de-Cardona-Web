import type { RequestHandler } from 'express';
import type { SessionUser } from '../types/index.js';
declare module 'express-session' {
    interface SessionData {
        user?: SessionUser;
    }
}
export declare function createSessionMiddleware(): RequestHandler;
