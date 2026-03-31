import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth } from '../middleware/auth.js'

export default function bookingRoutes(db) {
  const router = Router()

  // POST /api/bookings
  router.post('/', requireAuth, (req, res) => {
    const { providerId, serviceName, date, startTime, endTime, notes, totalAmount } = req.body

    if (!providerId || !serviceName || !date || !startTime) {
      return res.status(400).json({ error: 'Provider, service, date, and time are required' })
    }

    const id = uuid()
    db.prepare(`INSERT INTO bookings (id, customer_id, provider_id, service_name, date, start_time, end_time, status, notes, total_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`).run(
      id, req.user.id, providerId, serviceName, date, startTime, endTime || null, notes || null, totalAmount || null
    )

    res.json({ id, status: 'pending' })
  })

  // GET /api/bookings
  router.get('/', requireAuth, (req, res) => {
    const { status, providerId } = req.query
    let where = []
    let params = []

    if (req.user.role === 'provider') {
      const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
      if (!provider) return res.json([])
      where.push('b.provider_id = ?')
      params.push(provider.id)
    } else {
      where.push('b.customer_id = ?')
      params.push(req.user.id)
    }

    if (status) { where.push('b.status = ?'); params.push(status) }
    if (providerId) { where.push('b.provider_id = ?'); params.push(providerId) }

    const bookings = db.prepare(`
      SELECT b.*, p.business_name as provider_name, u.name as customer_name
      FROM bookings b
      JOIN providers p ON b.provider_id = p.id
      JOIN users u ON b.customer_id = u.id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY b.date DESC, b.start_time ASC
    `).all(...params)

    res.json(bookings.map(b => ({
      id: b.id, providerId: b.provider_id, provider: b.provider_name,
      customer: b.customer_name, customerId: b.customer_id,
      service: b.service_name, date: b.date,
      startTime: b.start_time, endTime: b.end_time,
      status: b.status, notes: b.notes, amount: b.total_amount,
    })))
  })

  // PATCH /api/bookings/:id/status
  router.patch('/:id/status', requireAuth, (req, res) => {
    const { status } = req.body
    if (!['confirmed', 'en-route', 'arriving-soon', 'arrived', 'in-progress', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    db.prepare('UPDATE bookings SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, req.params.id)
    res.json({ ok: true })
  })

  // GET /api/providers/:providerId/availability
  router.get('/providers/:providerId/availability', (req, res) => {
    const { from, to } = req.query
    const providerId = req.params.providerId

    // Get booked slots
    const bookedSlots = db.prepare(`
      SELECT date, start_time, end_time FROM bookings
      WHERE provider_id = ? AND date >= ? AND date <= ? AND status != 'cancelled'
    `).all(providerId, from || '2026-01-01', to || '2030-12-31')

    // Get provider hours
    const hours = db.prepare('SELECT * FROM provider_hours WHERE provider_id = ?').all(providerId)

    res.json({ bookedSlots, hours })
  })

  return router
}
