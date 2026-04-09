import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'El nombre de usuario es requerido.')
    .max(64),
  password: z
    .string()
    .min(1, 'La contraseña es requerida.')
    .max(128),
})

export type LoginFormValues = z.infer<typeof loginSchema>
