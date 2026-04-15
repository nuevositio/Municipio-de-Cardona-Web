import type { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import {
  listUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../models/user.model.js'
import { createAuditLog } from '../models/audit-log.model.js'
import { createUserSchema, updateUserSchema, resetPasswordSchema } from '../validators/index.js'
import { parseUuidParam } from '../utils/content-helpers.js'

// ── GET /api/admin/users ──────────────────────────────────────────────────────

export async function listUsersController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rows  = await listUsers()
    const users = rows.map(({ passwordHash: _, ...u }) => u)
    res.json({ users })
  } catch (error) {
    next(error)
  }
}

// ── GET /api/admin/users/:id ──────────────────────────────────────────────────

export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id   = parseUuidParam(req.params.id)
    const user = await findUserById(id)
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado.' })
      return
    }
    const { passwordHash: _, ...safe } = user
    res.json({ user: safe })
  } catch (error) {
    next(error)
  }
}

// ── POST /api/admin/users ─────────────────────────────────────────────────────

export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createUserSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos inválidos.',
        errors: parsed.error.flatten().fieldErrors,
      })
      return
    }

    const { username, email, password, role } = parsed.data
    const passwordHash = await bcrypt.hash(password, 12)

    const user = await createUser({
      username,
      email,
      passwordHash,
      role: role ?? 'admin',
      mustChangePassword: true,
    })

    void createAuditLog({
      userId:     req.session.user?.id ?? null,
      action:     'user_created',
      entityType: 'user',
      entityId:   user.id,
      details:    { username: user.username, role: user.role },
      ipAddress:  req.ip ?? null,
      userAgent:  req.headers['user-agent'] ?? null,
    })

    const { passwordHash: _, ...safe } = user
    res.status(201).json({ user: safe })
  } catch (error: unknown) {
    // Neon/PG lanza error con código '23505' para violación UNIQUE
    const pg = error as { code?: string; message?: string }
    if (pg.code === '23505' || pg.message?.includes('duplicate key')) {
      res.status(409).json({ message: 'El usuario o email ya está en uso.' })
      return
    }
    next(error)
  }
}

// ── PATCH /api/admin/users/:id ────────────────────────────────────────────────

export async function updateUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id     = parseUuidParam(req.params.id)
    const target = await findUserById(id)
    if (!target) {
      res.status(404).json({ message: 'Usuario no encontrado.' })
      return
    }

    if (target.role === 'superadmin' && req.body.role && req.body.role !== 'superadmin') {
      res.status(403).json({ message: 'No se puede cambiar el rol del superadmin.' })
      return
    }

    const parsed = updateUserSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos inválidos.',
        errors: parsed.error.flatten().fieldErrors,
      })
      return
    }

    const updated = await updateUser(id, parsed.data)
    if (!updated) {
      res.status(404).json({ message: 'Usuario no encontrado.' })
      return
    }

    void createAuditLog({
      userId:     req.session.user?.id ?? null,
      action:     'user_updated',
      entityType: 'user',
      entityId:   id,
      details:    parsed.data,
      ipAddress:  req.ip ?? null,
      userAgent:  req.headers['user-agent'] ?? null,
    })

    const { passwordHash: _, ...safe } = updated
    res.json({ user: safe })
  } catch (error) {
    next(error)
  }
}

// ── PATCH /api/admin/users/:id/reset-password ─────────────────────────────────

export async function resetPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id     = parseUuidParam(req.params.id)
    const parsed = resetPasswordSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos inválidos.',
        errors: parsed.error.flatten().fieldErrors,
      })
      return
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12)

    const updated = await updateUser(id, { passwordHash, mustChangePassword: true })
    if (!updated) {
      res.status(404).json({ message: 'Usuario no encontrado.' })
      return
    }

    void createAuditLog({
      userId:     req.session.user?.id ?? null,
      action:     'password_reset',
      entityType: 'user',
      entityId:   id,
      ipAddress:  req.ip ?? null,
      userAgent:  req.headers['user-agent'] ?? null,
    })

    res.json({ message: 'Contraseña actualizada correctamente.' })
  } catch (error) {
    next(error)
  }
}

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────

export async function deleteUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id             = parseUuidParam(req.params.id)
    const sessionUserId  = req.session.user?.id

    if (sessionUserId === id) {
      res.status(400).json({ message: 'No puedes eliminar tu propio usuario.' })
      return
    }

    const target = await findUserById(id)
    if (!target) {
      res.status(404).json({ message: 'Usuario no encontrado.' })
      return
    }

    if (target.role === 'superadmin') {
      res.status(403).json({ message: 'No se puede eliminar al superadmin.' })
      return
    }

    await deleteUser(id)

    void createAuditLog({
      userId:     sessionUserId ?? null,
      action:     'user_deleted',
      entityType: 'user',
      entityId:   id,
      details:    { username: target.username },
      ipAddress:  req.ip ?? null,
      userAgent:  req.headers['user-agent'] ?? null,
    })

    res.json({ message: 'Usuario eliminado correctamente.' })
  } catch (error) {
    next(error)
  }
}
