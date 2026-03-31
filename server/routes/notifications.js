import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth } from '../middleware/auth.js'

export default function notificationRoutes(db) {
  const router = Router()

  // GET /api/notifications
  router.get('/', requireAuth, (req, res) => {
    const notifications = db.prepare(`
      SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
    `).all(req.user.id)

    res.json(notifications)
  })

  // GET /api/notifications/unread-count
  router.get('/unread-count', requireAuth, (req, res) => {
    const result = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0').get(req.user.id)
    res.json({ count: result.count })
  })

  // PATCH /api/notifications/:id/read
  router.patch('/:id/read', requireAuth, (req, res) => {
    db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
    res.json({ ok: true })
  })

  // PATCH /api/notifications/read-all
  router.patch('/read-all', requireAuth, (req, res) => {
    db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(req.user.id)
    res.json({ ok: true })
  })

  // GET /api/notifications/preferences
  router.get('/preferences', requireAuth, (req, res) => {
    let prefs = db.prepare('SELECT * FROM notification_preferences WHERE user_id = ?').get(req.user.id)
    if (!prefs) {
      db.prepare('INSERT OR IGNORE INTO notification_preferences (user_id) VALUES (?)').run(req.user.id)
      prefs = { user_id: req.user.id, email_notifications: 1, sms_notifications: 1, push_notifications: 1, marketing_emails: 0 }
    }
    res.json({
      email: !!prefs.email_notifications,
      sms: !!prefs.sms_notifications,
      push: !!prefs.push_notifications,
      marketing: !!prefs.marketing_emails,
    })
  })

  // PUT /api/notifications/preferences
  router.put('/preferences', requireAuth, (req, res) => {
    const { email, sms, push, marketing } = req.body
    db.prepare(`INSERT INTO notification_preferences (user_id, email_notifications, sms_notifications, push_notifications, marketing_emails)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        email_notifications = excluded.email_notifications,
        sms_notifications = excluded.sms_notifications,
        push_notifications = excluded.push_notifications,
        marketing_emails = excluded.marketing_emails`).run(
      req.user.id, email ? 1 : 0, sms ? 1 : 0, push ? 1 : 0, marketing ? 1 : 0
    )
    res.json({ ok: true })
  })

  return router
}

// Helper to create notifications from other routes
export function createNotification(db, userId, type, title, message, data) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  db.prepare('INSERT INTO notifications (id, user_id, type, title, message, data) VALUES (?, ?, ?, ?, ?, ?)').run(
    id, userId, type, title, message, data ? JSON.stringify(data) : null
  )
}
