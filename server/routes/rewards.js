import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth } from '../middleware/auth.js'

const TIER_THRESHOLDS = { Bronze: 0, Silver: 500, Gold: 1500, Platinum: 3000 }

function getTier(points) {
  if (points >= 3000) return 'Platinum'
  if (points >= 1500) return 'Gold'
  if (points >= 500) return 'Silver'
  return 'Bronze'
}

export default function rewardRoutes(db) {
  const router = Router()

  // GET /api/rewards
  router.get('/', requireAuth, (req, res) => {
    const balance = db.prepare('SELECT COALESCE(SUM(points), 0) as total FROM rewards WHERE user_id = ?').get(req.user.id)
    const history = db.prepare('SELECT * FROM rewards WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id)

    const points = balance.total
    res.json({
      points,
      tier: getTier(points),
      tierThresholds: TIER_THRESHOLDS,
      history: history.map(h => ({
        id: h.id, action: h.action, points: h.points,
        type: h.type, date: h.created_at?.split('T')[0] || h.created_at,
      })),
    })
  })

  // POST /api/rewards/redeem
  router.post('/redeem', requireAuth, (req, res) => {
    const { points, action } = req.body
    if (!points || points <= 0) return res.status(400).json({ error: 'Invalid points' })

    const balance = db.prepare('SELECT COALESCE(SUM(points), 0) as total FROM rewards WHERE user_id = ?').get(req.user.id)
    if (balance.total < points) return res.status(400).json({ error: 'Insufficient points' })

    db.prepare('INSERT INTO rewards (id, user_id, action, points, type) VALUES (?, ?, ?, ?, "redeem")').run(
      uuid(), req.user.id, action || 'Redeemed reward', -points
    )

    res.json({ ok: true, newBalance: balance.total - points })
  })

  return router
}
