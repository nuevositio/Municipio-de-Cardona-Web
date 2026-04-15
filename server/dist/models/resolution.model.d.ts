import type { Resolution } from '../types/index.js';
export interface CreateResolutionInput {
    title: string;
    slug: string;
    summary?: string;
    fileUrl: string;
    status?: 'draft' | 'published';
    publishedAt?: Date | null;
    createdBy?: string | null;
}
export interface UpdateResolutionInput {
    title?: string;
    slug?: string;
    summary?: string;
    fileUrl?: string;
    status?: 'draft' | 'published';
    publishedAt?: Date | null;
    updatedBy?: string | null;
}
export interface ListResolutionsOptions {
    publishedOnly?: boolean;
    limit?: number;
    offset?: number;
}
export declare function findResolutionById(id: string): Promise<Resolution | undefined>;
export declare function findResolutionBySlug(slug: string): Promise<Resolution | undefined>;
export declare function listResolutions(options?: ListResolutionsOptions): Promise<Resolution[]>;
export declare function countResolutions(publishedOnly?: boolean): Promise<number>;
export declare function createResolution(input: CreateResolutionInput): Promise<Resolution>;
export declare function updateResolution(id: string, input: UpdateResolutionInput): Promise<Resolution | undefined>;
export declare function deleteResolution(id: string): Promise<void>;
export declare function slugExistsInResolutions(slug: string, exceptId?: string): Promise<boolean>;
