import type { AuditLog } from '../types/index.js';
export interface CreateAuditLogInput {
    userId?: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    details?: Record<string, unknown> | string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
}
export declare function createAuditLog(input: CreateAuditLogInput): Promise<void>;
export interface ListAuditLogsOptions {
    entityType?: string;
    entityId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
}
export declare function listAuditLogs(options?: ListAuditLogsOptions): Promise<AuditLog[]>;
export declare function countAuditLogs(options?: Omit<ListAuditLogsOptions, 'limit' | 'offset'>): Promise<number>;
