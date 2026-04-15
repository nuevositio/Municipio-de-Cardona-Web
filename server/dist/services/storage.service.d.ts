export declare const BUCKET_IMAGES = "news-images";
export declare const BUCKET_DOCS = "official-docs";
export declare const ALLOWED_IMAGE_TYPES: Set<string>;
export declare const ALLOWED_PDF_TYPES: Set<string>;
export declare const MAX_IMAGE_SIZE: number;
export declare const MAX_PDF_SIZE: number;
export interface UploadResult {
    url: string;
    path: string;
    bucket: string;
}
/**
 * Sube una imagen a Supabase Storage (bucket: news-images).
 * Valida MIME type y tamaño antes de enviar.
 */
export declare function uploadImage(buffer: Buffer, originalName: string, mimeType: string, size: number): Promise<UploadResult>;
/**
 * Sube un PDF a Supabase Storage (bucket: official-docs).
 * Valida MIME type y tamaño antes de enviar.
 */
export declare function uploadDocument(buffer: Buffer, originalName: string, mimeType: string, size: number): Promise<UploadResult>;
/**
 * Elimina un archivo de Supabase Storage dado su bucket y path interno.
 * Silencioso si el archivo no existe.
 */
export declare function deleteFile(bucket: string, storagePath: string): Promise<void>;
/**
 * Genera una URL firmada (temporal) para un archivo privado.
 * Por defecto expira en 1 hora.
 */
export declare function getSignedUrl(bucket: string, storagePath: string, expiresInSeconds?: number): Promise<string>;
