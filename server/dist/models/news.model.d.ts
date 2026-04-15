import type { NewsItem } from '../types/index.js';
export interface CreateNewsInput {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl?: string;
    status?: 'draft' | 'published';
    publishedAt?: Date | null;
    createdBy?: string | null;
}
export interface UpdateNewsInput {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    imageUrl?: string;
    status?: 'draft' | 'published';
    publishedAt?: Date | null;
    updatedBy?: string | null;
}
export interface ListNewsOptions {
    publishedOnly?: boolean;
    limit?: number;
    offset?: number;
}
export declare function findNewsById(id: string): Promise<NewsItem | undefined>;
export declare function findNewsBySlug(slug: string): Promise<NewsItem | undefined>;
export declare function listNews(options?: ListNewsOptions): Promise<NewsItem[]>;
export declare function countNews(publishedOnly?: boolean): Promise<number>;
export declare function createNews(input: CreateNewsInput): Promise<NewsItem>;
export declare function updateNews(id: string, input: UpdateNewsInput): Promise<NewsItem | undefined>;
/** Soft delete */
export declare function deleteNews(id: string): Promise<void>;
export declare function slugExistsInNews(slug: string, exceptId?: string): Promise<boolean>;
