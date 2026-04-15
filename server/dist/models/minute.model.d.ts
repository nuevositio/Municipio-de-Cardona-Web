import type { Minute } from '../types/index.js';
export interface CreateMinuteInput {
    title: string;
    slug: string;
    summary?: string;
    fileUrl: string;
    status?: 'draft' | 'published';
    publishedAt?: Date | null;
    createdBy?: string | null;
}
export interface UpdateMinuteInput {
    title?: string;
    slug?: string;
    summary?: string;
    fileUrl?: string;
    status?: 'draft' | 'published';
    publishedAt?: Date | null;
    updatedBy?: string | null;
}
export interface ListMinutesOptions {
    publishedOnly?: boolean;
    limit?: number;
    offset?: number;
}
export declare function findMinuteById(id: string): Promise<Minute | undefined>;
export declare function findMinuteBySlug(slug: string): Promise<Minute | undefined>;
export declare function listMinutes(options?: ListMinutesOptions): Promise<Minute[]>;
export declare function countMinutes(publishedOnly?: boolean): Promise<number>;
export declare function createMinute(input: CreateMinuteInput): Promise<Minute>;
export declare function updateMinute(id: string, input: UpdateMinuteInput): Promise<Minute | undefined>;
export declare function deleteMinute(id: string): Promise<void>;
export declare function slugExistsInMinutes(slug: string, exceptId?: string): Promise<boolean>;
