import type { Request, Response, NextFunction } from 'express';
export declare function listNewsController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getNewsController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createNewsController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateNewsController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteNewsController(req: Request, res: Response, next: NextFunction): Promise<void>;
