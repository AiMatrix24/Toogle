import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth } from '../middleware/auth.js'

export default function messageRoutes(db) {
  const router = Router()

  // GET /api/conversations
  router.get('/conversations', requireAuth, (req, res) => {
    const isProvider = req.user.role === 'provider'
    const provider = isProvider ? db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id) : null

    let conversations
    if (isProvider && provider) {
      conversations = db.prepare(`
        SELECT c.*, u.name as customer_name,
          (SELECT text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
          (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != ? AND status != 'read') as unread
        FROM conversations c JOIN users u ON c.customer_id = u.id
        WHERE c.provider_id = ? ORDER BY c.last_message_at DESC
      `).all(req.user.id, provider.id)
    } else {
      conversations = db.prepare(`
        SELECT c.*, p.business_name as provider_name, p.id as provider_id, p.category,
          (SELECT text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
          (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != ? AND status != 'read') as unread
        FROM conversations c JOIN providers p ON c.provider_id = p.id
        WHERE c.customer_id = ? ORDER BY c.last_message_at DESC
      `).all(req.user.id, req.user.id)
    }

    res.json(conversations)
  })

  // GET /api/conversations/with/:providerId
  router.get('/conversations/with/:providerId', requireAuth, (req, res) => {
    let conv = db.prepare('SELECT * FROM conversations WHERE customer_id = ? AND provider_id = ?')
      .get(req.user.id, req.params.providerId)

    if (!conv) {
      const id = uuid()
      db.prepare('INSERT INTO conversations (id, customer_id, provider_id) VALUES (?, ?, ?)').run(id, req.user.id, req.params.providerId)
      conv = { id, customer_id: req.user.id, provider_id: req.params.providerId }
    }

    const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').all(conv.id)

    // Mark as read
    db.prepare('UPDATE messages SET status = "read" WHERE conversation_id = ? AND sender_id != ?').run(conv.id, req.user.id)

    res.json({ conversation: conv, messages })
  })

  // POST /api/conversations/:id/messages
  router.post('/conversations/:id/messages', requireAuth, (req, res) => {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: 'Message text is required' })

    const id = uuid()
    db.prepare('INSERT INTO messages (id, conversation_id, sender_id, text) VALUES (?, ?, ?, ?)').run(id, req.params.id, req.user.id, text)
    db.prepare('UPDATE conversations SET last_message_at = datetime("now") WHERE id = ?').run(req.params.id)

    res.json({ id, text, sender_id: req.user.id, status: 'sent', created_at: new Date().toISOString() })
  })

  return router
}
