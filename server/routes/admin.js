import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'

export default function adminRoutes(db) {
  const router = Router()

  // All admin routes require admin role
  router.use(requireAuth, requireRole('admin'))

  // GET /api/admin/stats
  router.get('/stats', (req, res) => {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count
    const totalProviders = db.prepare('SELECT COUNT(*) as count FROM providers').get().count
    const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'").get().total
    const avgRating = db.prepare('SELECT AVG(rating) as avg FROM providers WHERE rating > 0').get().avg || 0
    const activeCustomers = db.prepare("SELECT COUNT(DISTINCT customer_id) as count FROM bookings WHERE date >= date('now', '-30 days')").get().count
    const openTickets = db.prepare("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'open'").get().count
    const pendingProviders = db.prepare('SELECT COUNT(*) as count FROM providers WHERE verified = 0').get().count

    res.json({
      totalUsers, totalProviders, totalBookings, totalRevenue,
      avgRating: Math.round(avgRating * 10) / 10,
      activeCustomers, openTickets, pendingProviders,
    })
  })

  // GET /api/admin/users
  router.get('/users', (req, res) => {
    const { role, search } = req.query
    let where = []
    let params = []

    if (role) { where.push('role = ?'); params.push(role) }
    if (search) { where.push('(name LIKE ? OR email LIKE ?)'); params.push(`%${search}%`, `%${search}%`) }

    const users = db.prepare(`
      SELECT id, email, name, phone, role, created_at FROM users
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY created_at DESC LIMIT 100
    `).all(...params)

    res.json(users)
  })

  // PATCH /api/admin/users/:id
  router.patch('/users/:id', (req, res) => {
    const { role } = req.body
    if (role) {
      db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id)
    }
    res.json({ ok: true })
  })

  // GET /api/admin/providers
  router.get('/providers', (req, res) => {
    const { verified } = req.query
    let where = []
    let params = []

    if (verified !== undefined) { where.push('p.verified = ?'); params.push(verified === 'true' ? 1 : 0) }

    const providers = db.prepare(`
      SELECT p.*, u.email, u.name as user_name FROM providers p
      JOIN users u ON p.user_id = u.id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY p.created_at DESC
    `).all(...params)

    res.json(providers.map(p => ({
      id: p.id, userId: p.user_id, name: p.business_name, email: p.email,
      category: p.category, hourlyRate: p.hourly_rate, rating: p.rating,
      reviewCount: p.review_count, verified: !!p.verified, available: !!p.available,
      createdAt: p.created_at,
    })))
  })

  // PATCH /api/admin/providers/:id/verify
  router.patch('/providers/:id/verify', (req, res) => {
    db.prepare('UPDATE providers SET verified = 1, updated_at = datetime("now") WHERE id = ?').run(req.params.id)
    res.json({ ok: true })
  })

  // GET /api/admin/tickets
  router.get('/tickets', (req, res) => {
    const tickets = db.prepare(`
      SELECT t.*, u.name as user_name, u.email as user_email
      FROM support_tickets t JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `).all()

    res.json(tickets.map(t => ({
      id: t.id, userName: t.user_name, userEmail: t.user_email,
      subject: t.subject, type: t.type, description: t.description,
      status: t.status, priority: t.priority, adminNotes: t.admin_notes,
      createdAt: t.created_at, updatedAt: t.updated_at,
    })))
  })

  // PATCH /api/admin/tickets/:id
  router.patch('/tickets/:id', (req, res) => {
    const { status, adminNotes } = req.body
    if (status) db.prepare('UPDATE support_tickets SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, req.params.id)
    if (adminNotes) db.prepare('UPDATE support_tickets SET admin_notes = ?, updated_at = datetime("now") WHERE id = ?').run(adminNotes, req.params.id)
    res.json({ ok: true })
  })

  return router
}
