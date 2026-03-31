import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth } from '../middleware/auth.js'

export default function paymentRoutes(db) {
  const router = Router()

  // POST /api/payments
  router.post('/', requireAuth, (req, res) => {
    const { bookingId, providerId, amount, subtotal, serviceFee, tax, paymentMethod } = req.body

    const id = uuid()
    const transactionId = 'TXN-' + uuid().slice(0, 8).toUpperCase()

    db.prepare(`INSERT INTO payments (id, booking_id, customer_id, provider_id, amount, subtotal, service_fee, tax, payment_method, status, transaction_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?)`).run(
      id, bookingId || null, req.user.id, providerId, amount, subtotal, serviceFee, tax, paymentMethod || 'samiteon', transactionId
    )

    // Update booking status
    if (bookingId) {
      db.prepare('UPDATE bookings SET status = "confirmed" WHERE id = ?').run(bookingId)
    }

    res.json({ id, transactionId, status: 'completed', blockchainHash: '0x' + uuid().replace(/-/g, '').slice(0, 16) })
  })

  // GET /api/payments
  router.get('/', requireAuth, (req, res) => {
    const isProvider = req.user.role === 'provider'
    const provider = isProvider ? db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id) : null

    let payments
    if (isProvider && provider) {
      payments = db.prepare(`
        SELECT p.*, u.name as customer_name FROM payments p
        JOIN users u ON p.customer_id = u.id
        WHERE p.provider_id = ? ORDER BY p.created_at DESC
      `).all(provider.id)
    } else {
      payments = db.prepare(`
        SELECT p.*, pr.business_name as provider_name FROM payments p
        JOIN providers pr ON p.provider_id = pr.id
        WHERE p.customer_id = ? ORDER BY p.created_at DESC
      `).all(req.user.id)
    }

    res.json(payments)
  })

  // GET /api/payments/:id
  router.get('/:id', requireAuth, (req, res) => {
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id)
    if (!payment) return res.status(404).json({ error: 'Payment not found' })
    res.json(payment)
  })

  return router
}
