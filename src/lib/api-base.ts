/**
 * URL base de la API.
 * - En desarrollo: cadena vacía → el proxy de Vite redirige /api/* a localhost:4000
 * - En producción (cPanel): VITE_API_URL = https://milocapp.onrender.com
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? ''
