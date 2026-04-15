/**
 * Genera un slug URL-amigable a partir de un texto arbitrario.
 * Reutilizable en noticias, actas y resoluciones.
 *
 * Ejemplo: "Título de Prueba #1!" → "titulo-de-prueba-1"
 */
export declare function slugify(text: string): string;
/**
 * Valida que un parámetro de ruta sea un UUID válido.
 * Lanza un error con código 400 si no lo es.
 */
export declare function parseUuidParam(raw: string | string[] | undefined, name?: string): string;
/**
 * Genera un slug único dado un título y una función async que comprueba existencia.
 * Si el slug base ya existe, añade sufijo incremental (-2, -3…).
 * Acepta un `exceptId` (UUID) para ignorar el propio registro en actualizaciones.
 *
 * @param title    - Texto del que se deriva el slug base.
 * @param existsFn - Función async que devuelve true si el slug ya está en uso.
 * @param exceptId - UUID a ignorar en la comprobación (para updates).
 */
export declare function buildUniqueSlug(title: string, existsFn: (slug: string, exceptId?: string) => Promise<boolean>, exceptId?: string): Promise<string>;
/**
 * Parsea los query params `limit` y `offset` con valores por defecto.
 */
export declare function parsePagination(query: Record<string, string | string[] | undefined>, defaults?: {
    limit: number;
    maxLimit: number;
}): {
    limit: number;
    offset: number;
};
