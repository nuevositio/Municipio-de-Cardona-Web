import { z } from 'zod'

// ── Crear usuario ─────────────────────────────────────────────────────────────

export const createUserFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres.')
    .max(64, 'Máximo 64 caracteres.')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Solo letras, números, _, . y -'),
  email: z.string().min(1, 'El correo es requerido.').email('Correo inválido.').max(255),
  password: z
    .string()
    .min(12, 'Mínimo 12 caracteres.')
    .max(128, 'Máximo 128 caracteres.'),
})

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>

// ── Editar usuario ────────────────────────────────────────────────────────────

export const editUserFormSchema = z.object({
  email:    z.string().email('Correo inválido.').max(255).optional().or(z.literal('')),
  role:     z.enum(['superadmin', 'admin', 'editor', 'prensa', 'consulta']).optional(),
  isActive: z.boolean().optional(),
})

export type EditUserFormValues = z.infer<typeof editUserFormSchema>

// ── Reset de contraseña ───────────────────────────────────────────────────────

export const resetPasswordFormSchema = z.object({
  newPassword: z
    .string()
    .min(12, 'Mínimo 12 caracteres.')
    .max(128, 'Máximo 128 caracteres.'),
})

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
