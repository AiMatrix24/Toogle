import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'

export default function analyticsRoutes(db) {
  const router = Router()

  // GET /api/analytics/provider
  router.get('/provider', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT * FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.status(404).json({ error: 'Provider not found' })

    const completedPayments = db.prepare(`SELECT * FROM payments WHERE provider_id = ? AND status = 'completed' ORDER BY created_at DESC`).all(provider.id)
    const allBookings = db.prepare('SELECT * FROM bookings WHERE provider_id = ?').all(provider.id)
    const payouts = db.prepare('SELECT * FROM payouts WHERE provider_id = ? ORDER BY created_at DESC').all(provider.id)

    // Monthly revenue (last 6 months)
    const months = []
    const labels = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = d.toISOString().slice(0, 7)
      labels.push(d.toLocaleString('en', { month: 'short' }))
      const monthPayments = completedPayments.filter(p => p.created_at?.startsWith(key))
      months.push(monthPayments.reduce((sum, p) => sum + p.amount, 0))
    }

    // Service revenue breakdown
    const serviceMap = {}
    allBookings.filter(b => b.status === 'completed').forEach(b => {
      if (!serviceMap[b.service_name]) serviceMap[b.service_name] = { service: b.service_name, revenue: 0, jobs: 0 }
      serviceMap[b.service_name].revenue += b.total_amount || 0
      serviceMap[b.service_name].jobs++
    })

    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0)
    const completedBookings = allBookings.filter(b => b.status === 'completed')
    const cancelledBookings = allBookings.filter(b => b.status === 'cancelled')

    res.json({
      monthlyRevenue: months,
      monthLabels: labels,
      totalJobs: completedBookings.length,
      avgJobValue: completedBookings.length > 0 ? Math.round(totalRevenue / completedBookings.length) : 0,
      repeatCustomerRate: 34, // TODO: compute from real data
      cancellationRate: allBookings.length > 0 ? Math.round((cancelledBookings.length / allBookings.length) * 100) : 0,
      serviceRevenue: Object.values(serviceMap),
      payouts: payouts.map(p => ({
        id: p.id, date: p.created_at, amount: p.amount,
        status: p.status, method: p.method,
      })),
    })
  })

  // GET /api/analytics/platform (admin)
  router.get('/platform', requireAuth, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' })

    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count
    const totalProviders = db.prepare('SELECT COUNT(*) as count FROM providers').get().count
    const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'").get().total
    const avgRating = db.prepare('SELECT AVG(rating) as avg FROM providers WHERE rating > 0').get().avg || 0

    res.json({
      totalUsers, totalProviders, totalBookings,
      totalRevenue, avgRating: Math.round(avgRating * 10) / 10,
      activeCustomers: db.prepare("SELECT COUNT(DISTINCT customer_id) as count FROM bookings WHERE date >= date('now', '-30 days')").get().count,
    })
  })

  return router
}
