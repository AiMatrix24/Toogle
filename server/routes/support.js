import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth } from '../middleware/auth.js'

export default function supportRoutes(db) {
  const router = Router()

  // POST /api/support - create ticket
  router.post('/', requireAuth, (req, res) => {
    const { subject, type, description, priority, referenceId } = req.body
    if (!subject) return res.status(400).json({ error: 'Subject is required' })

    const id = uuid()
    db.prepare(`INSERT INTO support_tickets (id, user_id, subject, type, description, priority, reference_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
      id, req.user.id, subject, type || 'general', description || '',
      priority || 'normal', referenceId || null
    )

    res.json({ id, referenceNumber: 'TKT-' + id.slice(0, 8).toUpperCase() })
  })

  // GET /api/support - list own tickets
  router.get('/', requireAuth, (req, res) => {
    const tickets = db.prepare(`
      SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.user.id)

    res.json(tickets.map(t => ({
      id: t.id,
      referenceNumber: 'TKT-' + t.id.slice(0, 8).toUpperCase(),
      subject: t.subject,
      type: t.type,
      description: t.description,
      status: t.status,
      priority: t.priority,
      adminNotes: t.admin_notes,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    })))
  })

  // GET /api/support/:id
  router.get('/:id', requireAuth, (req, res) => {
    const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id)
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
    res.json(ticket)
  })

  return router
}
