/**
 * Genera un slug URL-amigable a partir de un texto arbitrario.
 * Reutilizable en noticias, actas y resoluciones.
 *
 * Ejemplo: "Título de Prueba #1!" → "titulo-de-prueba-1"
 */
export function slugify(text) {
    return text
        .normalize('NFD') // descomponer acentos (á → a + ́)
        .replace(/[\u0300-\u036f]/g, '') // eliminar diacríticos
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // solo letras, números, espacios y guiones
        .trim()
        .replace(/[\s]+/g, '-') // espacios → guión
        .replace(/-{2,}/g, '-'); // guiones múltiples → uno solo
}
/**
 * Valida que un parámetro de ruta sea un UUID válido.
 * Lanza un error con código 400 si no lo es.
 */
export function parseUuidParam(raw, name = 'id') {
    const val = Array.isArray(raw) ? raw[0] : raw;
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!val || !UUID_RE.test(val)) {
        const err = new Error(`El parámetro '${name}' debe ser un UUID válido.`);
        err.code = '400';
        throw err;
    }
    return val;
}
/**
 * Genera un slug único dado un título y una función async que comprueba existencia.
 * Si el slug base ya existe, añade sufijo incremental (-2, -3…).
 * Acepta un `exceptId` (UUID) para ignorar el propio registro en actualizaciones.
 *
 * @param title    - Texto del que se deriva el slug base.
 * @param existsFn - Función async que devuelve true si el slug ya está en uso.
 * @param exceptId - UUID a ignorar en la comprobación (para updates).
 */
export async function buildUniqueSlug(title, existsFn, exceptId) {
    const root = slugify(title);
    if (!(await existsFn(root, exceptId)))
        return root;
    let i = 2;
    while (await existsFn(`${root}-${i}`, exceptId))
        i++;
    return `${root}-${i}`;
}
/**
 * Parsea los query params `limit` y `offset` con valores por defecto.
 */
export function parsePagination(query, defaults = { limit: 20, maxLimit: 100 }) {
    const rawLimit = Number(query.limit ?? defaults.limit);
    const rawOffset = Number(query.offset ?? 0);
    const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, defaults.maxLimit) : defaults.limit;
    const offset = Number.isInteger(rawOffset) && rawOffset >= 0 ? rawOffset : 0;
    return { limit, offset };
}
//# sourceMappingURL=content-helpers.js.map