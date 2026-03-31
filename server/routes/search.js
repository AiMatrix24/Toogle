import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth } from '../middleware/auth.js'

const SERVICE_CATEGORIES = [
  'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Landscaping', 'Painting',
  'Roofing', 'Auto Repair', 'Pest Control', 'Moving', 'Handyman', 'Locksmith'
]

export default function searchRoutes(db) {
  const router = Router()

  // GET /api/search/autocomplete?q=
  router.get('/autocomplete', (req, res) => {
    const { q } = req.query
    if (!q || q.length < 2) return res.json({ providers: [], services: [], categories: [] })

    const term = `%${q}%`

    const providers = db.prepare(`
      SELECT id, business_name as name, category FROM providers
      WHERE business_name LIKE ? OR category LIKE ? OR description LIKE ?
      LIMIT 4
    `).all(term, term, term)

    const serviceRows = db.prepare(`
      SELECT DISTINCT name FROM provider_services WHERE name LIKE ? LIMIT 4
    `).all(term)
    const services = serviceRows.map(s => s.name)

    const categories = SERVICE_CATEGORIES.filter(c =>
      c.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 3)

    res.json({ providers, services, categories })
  })

  // GET /api/search/saved - list saved searches
  router.get('/saved', requireAuth, (req, res) => {
    const saved = db.prepare('SELECT * FROM saved_searches WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(req.user.id)
    res.json(saved.map(s => ({
      id: s.id, query: s.query, category: s.category,
      filters: s.filters ? JSON.parse(s.filters) : {}, createdAt: s.created_at,
    })))
  })

  // POST /api/search/saved - save a search
  router.post('/saved', requireAuth, (req, res) => {
    const { query, category, filters } = req.body
    const id = uuid()
    db.prepare('INSERT INTO saved_searches (id, user_id, query, category, filters) VALUES (?, ?, ?, ?, ?)').run(
      id, req.user.id, query || '', category || '', filters ? JSON.stringify(filters) : null
    )
    res.json({ id })
  })

  // DELETE /api/search/saved/:id
  router.delete('/saved/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM saved_searches WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
    res.json({ ok: true })
  })

  // --- Renewal Reminders (Renewal Radar) ---

  // GET /api/search/reminders
  router.get('/reminders', requireAuth, (req, res) => {
    const reminders = db.prepare(`
      SELECT * FROM renewal_reminders WHERE user_id = ? AND status = 'active'
      ORDER BY reminder_date ASC
    `).all(req.user.id)
    res.json(reminders.map(r => ({
      id: r.id, serviceName: r.service_name, providerName: r.provider_name,
      providerId: r.provider_id, lastServiceDate: r.last_service_date,
      reminderDate: r.reminder_date, frequencyDays: r.frequency_days,
      status: r.status, notes: r.notes,
    })))
  })

  // POST /api/search/reminders
  router.post('/reminders', requireAuth, (req, res) => {
    const { serviceName, providerName, providerId, lastServiceDate, reminderDate, frequencyDays, notes } = req.body
    const id = uuid()
    db.prepare(`INSERT INTO renewal_reminders (id, user_id, service_name, provider_name, provider_id, last_service_date, reminder_date, frequency_days, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, req.user.id, serviceName, providerName || null, providerId || null,
      lastServiceDate || null, reminderDate, frequencyDays || 365, notes || null
    )
    res.json({ id })
  })

  // PATCH /api/search/reminders/:id
  router.patch('/reminders/:id', requireAuth, (req, res) => {
    const { status, reminderDate } = req.body
    if (status) db.prepare('UPDATE renewal_reminders SET status = ? WHERE id = ? AND user_id = ?').run(status, req.params.id, req.user.id)
    if (reminderDate) db.prepare('UPDATE renewal_reminders SET reminder_date = ? WHERE id = ? AND user_id = ?').run(reminderDate, req.params.id, req.user.id)
    res.json({ ok: true })
  })

  return router
}
