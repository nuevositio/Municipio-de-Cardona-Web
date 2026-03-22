import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'desarrollo-local-no-usar-en-produccion'

export function signAdminToken(username) {
  return jwt.sign({ username, role: 'admin' }, jwtSecret, { expiresIn: '8h' })
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No autenticado.' })
    return
  }

  const token = header.replace('Bearer ', '').trim()

  try {
    const payload = jwt.verify(token, jwtSecret)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ message: 'Token invalido o expirado.' })
  }
}
