import type { Request, Response, NextFunction } from 'express';
export declare function listUsersController(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getUserController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createUserController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateUserController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function resetPasswordController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteUserController(req: Request, res: Response, next: NextFunction): Promise<void>;
