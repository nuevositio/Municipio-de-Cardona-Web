import { z } from 'zod'

// ── Reglas compartidas ────────────────────────────────────────────────────────

const slugRule = z
  .string()
  .max(255)
  .regex(/^[a-z0-9-]*$/, 'Solo minúsculas, números y guiones.')
  .optional()
  .or(z.literal(''))

// ── Noticias ──────────────────────────────────────────────────────────────────

export const newsFormSchema = z.object({
  title:       z.string().min(1, 'El título es requerido.').max(255),
  slug:        slugRule,
  excerpt:     z.string().min(1, 'El extracto es requerido.').max(500),
  content:     z.string().min(1, 'El contenido es requerido.'),
  imageUrl:    z.string().max(1000).optional().or(z.literal('')),
  publishedAt: z.string().optional().or(z.literal('')),
})

export type NewsFormValues = z.infer<typeof newsFormSchema>

// ── Actas ─────────────────────────────────────────────────────────────────────

export const minuteFormSchema = z.object({
  title:       z.string().min(1, 'El título es requerido.').max(255),
  slug:        slugRule,
  summary:     z.string().max(1000).optional().or(z.literal('')),
  fileUrl:     z.string().min(1, 'El archivo es requerido.').max(2000),
  publishedAt: z.string().optional().or(z.literal('')),
})

export type MinuteFormValues = z.infer<typeof minuteFormSchema>

// ── Resoluciones ──────────────────────────────────────────────────────────────

export const resolutionFormSchema = minuteFormSchema
export type ResolutionFormValues = MinuteFormValues
