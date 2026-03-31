import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth } from '../middleware/auth.js'

export default function referralRoutes(db) {
  const router = Router()

  // GET /api/referrals
  router.get('/', requireAuth, (req, res) => {
    // Generate a referral code if user doesn't have one
    let existingCode = db.prepare('SELECT code FROM referrals WHERE referrer_id = ? LIMIT 1').get(req.user.id)
    const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.user.id)
    const code = existingCode?.code || `${(user?.name || 'USER').split(' ')[0].toUpperCase()}-TGL-2026`

    const referrals = db.prepare('SELECT * FROM referrals WHERE referrer_id = ? ORDER BY created_at DESC').all(req.user.id)
    const totalReferrals = referrals.length
    const successful = referrals.filter(r => r.status === 'completed').length
    const pending = referrals.filter(r => r.status === 'pending').length
    const earnedCredit = referrals.reduce((sum, r) => sum + (r.reward_amount || 0), 0)

    res.json({
      code,
      totalReferrals,
      pendingReferrals: pending,
      earnedCredit,
      successfulConversions: successful,
      history: referrals.map(r => ({
        id: r.id, name: r.referred_id || 'Unknown', date: r.created_at,
        status: r.status === 'completed' ? 'Credit Earned' : 'Signed Up',
        reward: r.reward_amount || 0,
      })),
    })
  })

  return router
}
