import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth } from '../middleware/auth.js'

export default function userRoutes(db) {
  const router = Router()

  // GET /api/users/me/profile
  router.get('/me/profile', requireAuth, (req, res) => {
    const user = db.prepare('SELECT id, email, name, phone, role, address, city, state, zip, created_at FROM users WHERE id = ?').get(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Stats
    const bookingStats = db.prepare(`
      SELECT COUNT(*) as total, SUM(total_amount) as spent
      FROM bookings WHERE customer_id = ?
    `).get(req.user.id)

    const favCount = db.prepare('SELECT COUNT(*) as count FROM favorites WHERE user_id = ?').get(req.user.id)

    // Rewards balance
    const rewardsBalance = db.prepare('SELECT COALESCE(SUM(points), 0) as total FROM rewards WHERE user_id = ?').get(req.user.id)

    res.json({
      ...user,
      totalBookings: bookingStats.total || 0,
      totalSpent: bookingStats.spent || 0,
      savedProviders: favCount.count || 0,
      rewardsPoints: rewardsBalance.total || 0,
      memberSince: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    })
  })

  // PUT /api/users/me
  router.put('/me', requireAuth, (req, res) => {
    const { name, phone, address, city, state, zip } = req.body

    db.prepare(`UPDATE users SET
      name = COALESCE(?, name),
      phone = COALESCE(?, phone),
      address = COALESCE(?, address),
      city = COALESCE(?, city),
      state = COALESCE(?, state),
      zip = COALESCE(?, zip),
      updated_at = datetime('now')
    WHERE id = ?`).run(name, phone, address, city, state, zip, req.user.id)

    res.json({ ok: true })
  })

  // GET /api/users/me/favorites
  router.get('/me/favorites', requireAuth, (req, res) => {
    const favorites = db.prepare('SELECT provider_id FROM favorites WHERE user_id = ?').all(req.user.id)
    res.json(favorites.map(f => f.provider_id))
  })

  // POST /api/users/me/favorites/:providerId
  router.post('/me/favorites/:providerId', requireAuth, (req, res) => {
    try {
      db.prepare('INSERT INTO favorites (user_id, provider_id) VALUES (?, ?)').run(req.user.id, req.params.providerId)
      db.prepare('UPDATE providers SET favorite_count = favorite_count + 1 WHERE id = ?').run(req.params.providerId)
      res.json({ ok: true })
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
        return res.json({ ok: true }) // Already favorited
      }
      throw e
    }
  })

  // DELETE /api/users/me/favorites/:providerId
  router.delete('/me/favorites/:providerId', requireAuth, (req, res) => {
    const result = db.prepare('DELETE FROM favorites WHERE user_id = ? AND provider_id = ?').run(req.user.id, req.params.providerId)
    if (result.changes > 0) {
      db.prepare('UPDATE providers SET favorite_count = MAX(favorite_count - 1, 0) WHERE id = ?').run(req.params.providerId)
    }
    res.json({ ok: true })
  })

  // GET /api/users/me/bookings
  router.get('/me/bookings', requireAuth, (req, res) => {
    const isProvider = req.user.role === 'provider'
    const provider = isProvider ? db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id) : null

    let bookings
    if (isProvider && provider) {
      bookings = db.prepare(`
        SELECT b.*, u.name as customer_name
        FROM bookings b JOIN users u ON b.customer_id = u.id
        WHERE b.provider_id = ? ORDER BY b.date DESC, b.start_time ASC
      `).all(provider.id)
    } else {
      bookings = db.prepare(`
        SELECT b.*, p.business_name as provider_name, p.id as provider_id
        FROM bookings b JOIN providers p ON b.provider_id = p.id
        WHERE b.customer_id = ? ORDER BY b.date DESC
      `).all(req.user.id)
    }

    res.json(bookings.map(b => ({
      id: b.id,
      service: b.service_name,
      provider: b.provider_name || undefined,
      providerId: b.provider_id,
      customer: b.customer_name || undefined,
      date: b.date,
      startTime: b.start_time,
      endTime: b.end_time,
      status: b.status,
      notes: b.notes,
      amount: b.total_amount,
    })))
  })

  return router
}
