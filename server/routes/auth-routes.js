import { Router } from 'express'

import { requireAuth, signAdminToken } from '../middleware/auth.js'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body

  const adminUser = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminUser || !adminPassword) {
    res.status(500).json({ message: 'Credenciales de administrador no configuradas.' })
    return
  }

  if (username !== adminUser || password !== adminPassword) {
    res.status(401).json({ message: 'Usuario o contrasena incorrectos.' })
    return
  }

  const token = signAdminToken(username)

  res.json({
    token,
    user: { username },
  })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

export { router as authRoutes }
