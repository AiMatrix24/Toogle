import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { generateToken, requireAuth } from '../middleware/auth.js'

export default function authRoutes(db) {
  const router = Router()

  // POST /api/auth/signup
  router.post('/signup', (req, res) => {
    const { email, password, name, phone, role, businessName, category, description, hourlyRate, address, city, state, zip } = req.body

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Email, password, name, and role are required' })
    }
    if (!['customer', 'provider'].includes(role)) {
      return res.status(400).json({ error: 'Role must be customer or provider' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const userId = uuid()
    const passwordHash = bcrypt.hashSync(password, 10)

    db.prepare(`INSERT INTO users (id, email, password_hash, name, phone, role, address, city, state, zip)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      userId, email, passwordHash, name, phone || null, role,
      address || null, city || null, state || null, zip || null
    )

    // If provider, create provider record
    if (role === 'provider') {
      const providerId = uuid()
      db.prepare(`INSERT INTO providers (id, user_id, business_name, category, description, hourly_rate, phone, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
        providerId, userId, businessName || name, category || 'Handyman',
        description || '', hourlyRate ? parseFloat(hourlyRate) : 0,
        phone || null, address ? `${address}, ${city || ''}, ${state || ''} ${zip || ''}`.trim() : null
      )
    }

    const user = { id: userId, email, name, role, phone }
    const token = generateToken(user)

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ user: { id: userId, email, name, role, phone } })
  })

  // POST /api/auth/login
  router.post('/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = generateToken(user)

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // If provider, include provider info
    let providerInfo = null
    if (user.role === 'provider') {
      providerInfo = db.prepare('SELECT id as providerId FROM providers WHERE user_id = ?').get(user.id)
    }

    res.json({
      user: {
        id: user.id, email: user.email, name: user.name,
        role: user.role, phone: user.phone,
        ...(providerInfo || {})
      }
    })
  })

  // POST /api/auth/logout
  router.post('/logout', (req, res) => {
    res.clearCookie('token')
    res.json({ ok: true })
  })

  // GET /api/auth/me
  router.get('/me', requireAuth, (req, res) => {
    const user = db.prepare('SELECT id, email, name, phone, role, address, city, state, zip, created_at FROM users WHERE id = ?').get(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    let providerInfo = null
    if (user.role === 'provider') {
      providerInfo = db.prepare('SELECT id as providerId, business_name, category FROM providers WHERE user_id = ?').get(user.id)
    }

    res.json({ user: { ...user, ...(providerInfo || {}) } })
  })

  // POST /api/auth/forgot-password
  router.post('/forgot-password', (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (!user) return res.json({ ok: true }) // Don't reveal if user exists

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = new Date(Date.now() + 3600000).toISOString() // 1 hour

    db.prepare('INSERT INTO password_resets (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)').run(
      uuid(), user.id, code, expiresAt
    )

    console.log(`[PASSWORD RESET] Code for ${email}: ${code}`)
    res.json({ ok: true, devCode: code }) // devCode for testing - remove in production
  })

  // POST /api/auth/reset-password
  router.post('/reset-password', (req, res) => {
    const { email, code, newPassword } = req.body
    if (!email || !code || !newPassword) return res.status(400).json({ error: 'All fields required' })
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (!user) return res.status(400).json({ error: 'Invalid reset code' })

    const reset = db.prepare(`
      SELECT * FROM password_resets
      WHERE user_id = ? AND token = ? AND used = 0 AND expires_at > datetime('now')
      ORDER BY created_at DESC LIMIT 1
    `).get(user.id, code)

    if (!reset) return res.status(400).json({ error: 'Invalid or expired reset code' })

    const passwordHash = bcrypt.hashSync(newPassword, 10)
    db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?').run(passwordHash, user.id)
    db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(reset.id)

    res.json({ ok: true })
  })

  return router
}
