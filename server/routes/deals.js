import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

export default function dealRoutes(db) {
  const router = Router()

  // GET /api/deals
  router.get('/', optionalAuth, (req, res) => {
    const { limit } = req.query
    const deals = db.prepare(`
      SELECT d.*, p.business_name as provider_name, p.category as provider_category
      FROM deals d JOIN providers p ON d.provider_id = p.id
      WHERE d.active = 1
      ORDER BY d.created_at DESC
      ${limit ? 'LIMIT ?' : ''}
    `).all(...(limit ? [parseInt(limit)] : []))

    res.json(deals.map(d => ({
      id: d.id, providerId: d.provider_id, providerName: d.provider_name,
      title: d.title, description: d.description,
      originalPrice: d.original_price, dealPrice: d.deal_price,
      percentOff: d.percent_off, category: d.category || d.provider_category,
      maxClaims: d.max_claims, claimedCount: d.claimed_count,
      expiresAt: d.expires_at, active: !!d.active,
    })))
  })

  // POST /api/deals
  router.post('/', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.status(403).json({ error: 'Only providers can create deals' })

    const { title, description, originalPrice, dealPrice, percentOff, category, maxClaims, expiresAt } = req.body
    const id = uuid()

    db.prepare(`INSERT INTO deals (id, provider_id, title, description, original_price, deal_price, percent_off, category, max_claims, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, provider.id, title, description, originalPrice, dealPrice, percentOff, category, maxClaims, expiresAt
    )

    res.json({ id, title })
  })

  // POST /api/deals/:id/claim
  router.post('/:id/claim', requireAuth, (req, res) => {
    const deal = db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id)
    if (!deal) return res.status(404).json({ error: 'Deal not found' })
    if (deal.claimed_count >= deal.max_claims) return res.status(400).json({ error: 'Deal is fully claimed' })

    try {
      db.prepare('INSERT INTO deal_claims (id, deal_id, user_id) VALUES (?, ?, ?)').run(uuid(), req.params.id, req.user.id)
      db.prepare('UPDATE deals SET claimed_count = claimed_count + 1 WHERE id = ?').run(req.params.id)
      res.json({ ok: true })
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'Already claimed' })
      }
      throw e
    }
  })

  return router
}
