import { z } from 'zod'

// ── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  username:     z.string().min(1, 'El usuario es requerido.').max(64),
  password:     z.string().min(1, 'La contraseña es requerida.').max(128),
  captchaToken: z.string().min(1, 'La verificación CAPTCHA es requerida.'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ── Helpers de validación reutilizables ──────────────────────────────────────

/** Slug URL-amigable: solo minúsculas, números y guiones. */
const slugRule = z
  .string()
  .min(1, 'El slug es requerido.')
  .max(255)
  .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener minúsculas, números y guiones.')

/**
 * Fecha ISO-8601 completa (YYYY-MM-DDTHH:mm:ssZ) o solo fecha (YYYY-MM-DD).
 * Usada para publishedAt cuando el cliente quiere programar publicación.
 */
const isoDateRule = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/,
    'Formato de fecha inválido. Use YYYY-MM-DD o ISO-8601 completo.',
  )

// ── Noticias ──────────────────────────────────────────────────────────────────

export const createNewsSchema = z.object({
  title:       z.string().min(1, 'El título es requerido.').max(255),
  slug:        slugRule.optional(),
  excerpt:     z.string().min(1, 'El extracto es requerido.').max(500),
  content:     z.string().min(1, 'El contenido es requerido.'),
  imageUrl:    z.string().url('URL de imagen inválida.').max(1000).optional().default(''),
  publishedAt: isoDateRule.nullable().optional(),
})

export type CreateNewsPayload = z.infer<typeof createNewsSchema>

export const updateNewsSchema = z
  .object({
    title:       z.string().min(1).max(255).optional(),
    slug:        slugRule.optional(),
    excerpt:     z.string().min(1).max(500).optional(),
    content:     z.string().min(1).optional(),
    imageUrl:    z.string().url('URL de imagen inválida.').max(1000).optional(),
    publishedAt: isoDateRule.nullable().optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: 'Debe enviar al menos un campo para actualizar.' },
  )

export type UpdateNewsPayload = z.infer<typeof updateNewsSchema>

// ── Actas de concejo (minutes) ────────────────────────────────────────────────

/** Acepta únicamente URLs HTTPS (Supabase Storage). */
const fileUrlRule = z
  .string()
  .min(1, 'La URL del archivo es requerida.')
  .max(1000)
  .url('La URL del archivo debe ser una URL HTTPS válida.')

export const createMinuteSchema = z.object({
  title:       z.string().min(1, 'El título es requerido.').max(255),
  slug:        slugRule.optional(),
  summary:     z.string().max(1000).optional().default(''),
  fileUrl:     fileUrlRule,
  publishedAt: isoDateRule.nullable().optional(),
})

export type CreateMinutePayload = z.infer<typeof createMinuteSchema>

export const updateMinuteSchema = z
  .object({
    title:       z.string().min(1).max(255).optional(),
    slug:        slugRule.optional(),
    summary:     z.string().max(1000).optional(),
    fileUrl:     fileUrlRule.optional(),
    publishedAt: isoDateRule.nullable().optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: 'Debe enviar al menos un campo para actualizar.' },
  )

export type UpdateMinutePayload = z.infer<typeof updateMinuteSchema>

// ── Resoluciones ──────────────────────────────────────────────────────────────

export const createResolutionSchema = z.object({
  title:       z.string().min(1, 'El título es requerido.').max(255),
  slug:        slugRule.optional(),
  summary:     z.string().max(1000).optional().default(''),
  fileUrl:     fileUrlRule,
  publishedAt: isoDateRule.nullable().optional(),
})

export type CreateResolutionPayload = z.infer<typeof createResolutionSchema>

export const updateResolutionSchema = z
  .object({
    title:       z.string().min(1).max(255).optional(),
    slug:        slugRule.optional(),
    summary:     z.string().max(1000).optional(),
    fileUrl:     fileUrlRule.optional(),
    publishedAt: isoDateRule.nullable().optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: 'Debe enviar al menos un campo para actualizar.' },
  )

export type UpdateResolutionPayload = z.infer<typeof updateResolutionSchema>

// ── Gestión de usuarios ───────────────────────────────────────────────────────

/** Nombre de usuario: letras, números, _, . y - (3-64 chars) */
const usernameRule = z
  .string()
  .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
  .max(64, 'El nombre de usuario no puede superar los 64 caracteres.')
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    'El nombre de usuario solo puede contener letras, números, _, . y -',
  )

/** Contraseña segura: 12-128 chars */
const passwordRule = z
  .string()
  .min(12, 'La contraseña debe tener mínimo 12 caracteres.')
  .max(128, 'La contraseña no puede superar los 128 caracteres.')

export const createUserSchema = z.object({
  username: usernameRule,
  email:    z.string().email('Correo electrónico inválido.').max(255),
  password: passwordRule,
  role:     z.enum(['superadmin', 'admin', 'editor', 'prensa', 'consulta']).default('admin'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = z
  .object({
    email:    z.string().email('Correo electrónico inválido.').max(255).optional(),
    role:     z.enum(['superadmin', 'admin', 'editor', 'prensa', 'consulta']).optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: 'Debe enviar al menos un campo para actualizar.' },
  )

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const resetPasswordSchema = z.object({
  newPassword: passwordRule,
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

