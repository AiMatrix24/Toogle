import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

export default function reviewRoutes(db) {
  const router = Router()

  // POST /api/reviews
  router.post('/', requireAuth, (req, res) => {
    const { providerId, bookingId, rating, text, tags } = req.body
    if (!providerId || !rating) return res.status(400).json({ error: 'Provider and rating required' })

    const id = uuid()
    db.prepare(`INSERT INTO reviews (id, booking_id, customer_id, provider_id, rating, text, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
      id, bookingId || null, req.user.id, providerId, rating, text || '', tags ? JSON.stringify(tags) : null
    )

    // Update provider rating
    const stats = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE provider_id = ?').get(providerId)
    db.prepare('UPDATE providers SET rating = ?, review_count = ? WHERE id = ?').run(
      Math.round(stats.avg * 10) / 10, stats.count, providerId
    )

    // Also insert into provider_reviews for the detail view
    const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.user.id)
    db.prepare('INSERT INTO provider_reviews (id, provider_id, user_name, rating, text, date) VALUES (?, ?, ?, ?, ?, date("now"))').run(
      uuid(), providerId, user?.name || 'Anonymous', rating, text || ''
    )

    res.json({ id })
  })

  // GET /api/reviews - all reviews (for review hub)
  router.get('/', optionalAuth, (req, res) => {
    const { providerId } = req.query

    let reviews
    if (providerId) {
      reviews = db.prepare(`
        SELECT r.*, u.name as customer_name, p.business_name as provider_name
        FROM reviews r JOIN users u ON r.customer_id = u.id JOIN providers p ON r.provider_id = p.id
        WHERE r.provider_id = ? ORDER BY r.created_at DESC
      `).all(providerId)
    } else {
      reviews = db.prepare(`
        SELECT r.*, u.name as customer_name, p.business_name as provider_name
        FROM reviews r JOIN users u ON r.customer_id = u.id JOIN providers p ON r.provider_id = p.id
        ORDER BY r.created_at DESC LIMIT 100
      `).all()
    }

    res.json(reviews.map(r => ({
      id: r.id, providerId: r.provider_id, providerName: r.provider_name,
      customerName: r.customer_name, rating: r.rating, text: r.text,
      tags: r.tags ? JSON.parse(r.tags) : [],
      providerResponse: r.provider_response, date: r.created_at,
    })))
  })

  // PUT /api/reviews/:id/response - provider responds to a review
  router.put('/:id/response', requireAuth, (req, res) => {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: 'Response text required' })

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id)
    if (!review) return res.status(404).json({ error: 'Review not found' })

    // Verify the user owns the provider
    const provider = db.prepare('SELECT * FROM providers WHERE id = ? AND user_id = ?').get(review.provider_id, req.user.id)
    if (!provider) return res.status(403).json({ error: 'Only the provider can respond to their reviews' })

    db.prepare('UPDATE reviews SET provider_response = ? WHERE id = ?').run(text, req.params.id)
    res.json({ ok: true })
  })

  return router
}
