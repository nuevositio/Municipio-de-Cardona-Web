import type { Request, Response, NextFunction } from 'express';
export declare function loginController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function logoutController(req: Request, res: Response, next: NextFunction): void;
export declare function meController(req: Request, res: Response): void;
