import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    captchaToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    captchaToken: string;
}, {
    username: string;
    password: string;
    captchaToken: string;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const createNewsSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodString;
    content: z.ZodString;
    imageUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
}, {
    title: string;
    excerpt: string;
    content: string;
    slug?: string | undefined;
    imageUrl?: string | undefined;
    publishedAt?: string | null | undefined;
}>;
export type CreateNewsPayload = z.infer<typeof createNewsSchema>;
export declare const updateNewsSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
    imageUrl?: string | undefined;
    publishedAt?: string | null | undefined;
}, {
    title?: string | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
    imageUrl?: string | undefined;
    publishedAt?: string | null | undefined;
}>, {
    title?: string | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
    imageUrl?: string | undefined;
    publishedAt?: string | null | undefined;
}, {
    title?: string | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
    imageUrl?: string | undefined;
    publishedAt?: string | null | undefined;
}>;
export type UpdateNewsPayload = z.infer<typeof updateNewsSchema>;
export declare const createMinuteSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    summary: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    fileUrl: z.ZodString;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    summary: string;
    fileUrl: string;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
}, {
    title: string;
    fileUrl: string;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
    summary?: string | undefined;
}>;
export type CreateMinutePayload = z.infer<typeof createMinuteSchema>;
export declare const updateMinuteSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    fileUrl: z.ZodOptional<z.ZodString>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
    summary?: string | undefined;
    fileUrl?: string | undefined;
}, {
    title?: string | undefined;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
    summary?: string | undefined;
    fileUrl?: string | undefined;
}>, {
    title?: string | undefined;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
    summary?: string | undefined;
    fileUrl?: string | undefined;
}, {
    title?: string | undefined;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
    summary?: string | undefined;
    fileUrl?: string | undefined;
}>;
export type UpdateMinutePayload = z.infer<typeof updateMinuteSchema>;
export declare const createResolutionSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    summary: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    fileUrl: z.ZodString;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    summary: string;
    fileUrl: string;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
}, {
    title: string;
    fileUrl: string;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
    summary?: string | undefined;
}>;
export type CreateResolutionPayload = z.infer<typeof createResolutionSchema>;
export declare const updateResolutionSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    fileUrl: z.ZodOptional<z.ZodString>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
    summary?: string | undefined;
    fileUrl?: string | undefined;
}, {
    title?: string | undefined;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
    summary?: string | undefined;
    fileUrl?: string | undefined;
}>, {
    title?: string | undefined;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
    summary?: string | undefined;
    fileUrl?: string | undefined;
}, {
    title?: string | undefined;
    slug?: string | undefined;
    publishedAt?: string | null | undefined;
    summary?: string | undefined;
    fileUrl?: string | undefined;
}>;
export type UpdateResolutionPayload = z.infer<typeof updateResolutionSchema>;
export declare const createUserSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["superadmin", "admin", "editor", "prensa", "consulta"]>>;
}, "strip", z.ZodTypeAny, {
    username: string;
    email: string;
    role: "superadmin" | "admin" | "editor" | "prensa" | "consulta";
    password: string;
}, {
    username: string;
    email: string;
    password: string;
    role?: "superadmin" | "admin" | "editor" | "prensa" | "consulta" | undefined;
}>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export declare const updateUserSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["superadmin", "admin", "editor", "prensa", "consulta"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    role?: "superadmin" | "admin" | "editor" | "prensa" | "consulta" | undefined;
    isActive?: boolean | undefined;
}, {
    email?: string | undefined;
    role?: "superadmin" | "admin" | "editor" | "prensa" | "consulta" | undefined;
    isActive?: boolean | undefined;
}>, {
    email?: string | undefined;
    role?: "superadmin" | "admin" | "editor" | "prensa" | "consulta" | undefined;
    isActive?: boolean | undefined;
}, {
    email?: string | undefined;
    role?: "superadmin" | "admin" | "editor" | "prensa" | "consulta" | undefined;
    isActive?: boolean | undefined;
}>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export declare const resetPasswordSchema: z.ZodObject<{
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    newPassword: string;
}, {
    newPassword: string;
}>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
