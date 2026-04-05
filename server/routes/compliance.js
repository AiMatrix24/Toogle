import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth, requireRole } from '../middleware/auth.js'

export default function complianceRoutes(db) {
  const router = Router()

  // GET /api/compliance/audit-log - Admin query compliance events
  router.get('/audit-log', requireAuth, requireRole('admin'), (req, res) => {
    const { eventType, entityType, entityId, from, to, limit } = req.query
    let where = []
    let params = []

    if (eventType) { where.push('event_type = ?'); params.push(eventType) }
    if (entityType) { where.push('entity_type = ?'); params.push(entityType) }
    if (entityId) { where.push('entity_id = ?'); params.push(entityId) }
    if (from) { where.push('created_at >= ?'); params.push(from) }
    if (to) { where.push('created_at <= ?'); params.push(to) }

    const events = db.prepare(`
      SELECT * FROM compliance_events
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY created_at DESC LIMIT ?
    `).all(...params, parseInt(limit) || 100)

    res.json(events.map(e => ({
      id: e.id, eventType: e.event_type, entityType: e.entity_type,
      entityId: e.entity_id, actorId: e.actor_id, actorRole: e.actor_role,
      detail: e.detail ? JSON.parse(e.detail) : null,
      ipAddress: e.ip_address, createdAt: e.created_at,
    })))
  })

  // GET /api/compliance/consent/:leadId - Consent record for lead
  router.get('/consent/:leadId', requireAuth, (req, res) => {
    const lead = db.prepare('SELECT * FROM qade_leads WHERE id = ?').get(req.params.leadId)
    if (!lead) return res.status(404).json({ error: 'Lead not found' })

    const consentEvents = db.prepare(`
      SELECT * FROM compliance_events WHERE entity_id = ? AND event_type = 'consent_captured'
      ORDER BY created_at DESC
    `).all(req.params.leadId)

    res.json({
      leadId: lead.id,
      tcpaConsent: !!lead.tcpa_consent,
      tcpaTimestamp: lead.tcpa_consent_timestamp,
      tcpaIp: lead.tcpa_consent_ip,
      tcpaLanguage: lead.tcpa_consent_language,
      trustedFormCert: lead.trusted_form_cert_url,
      dncChecked: !!lead.dnc_checked,
      dncClean: !!lead.dnc_clean,
      consentEvents,
    })
  })

  // POST /api/compliance/data-request - CCPA data access
  router.post('/data-request', requireAuth, (req, res) => {
    const { email } = req.body
    const searchEmail = email || req.user.email

    const leads = db.prepare('SELECT * FROM qade_leads WHERE email = ?').all(searchEmail)
    const appointments = leads.flatMap(l =>
      db.prepare('SELECT * FROM qade_appointments WHERE lead_id = ?').all(l.id)
    )
    const consentEvents = leads.flatMap(l =>
      db.prepare('SELECT * FROM compliance_events WHERE entity_id = ?').all(l.id)
    )

    // Log the data access request
    db.prepare('INSERT INTO compliance_events (id, event_type, entity_type, entity_id, actor_id, actor_role, detail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))').run(
      uuid(), 'data_access', 'user', req.user.id, req.user.id, req.user.role,
      JSON.stringify({ requestedEmail: searchEmail, leadsFound: leads.length })
    )

    res.json({
      leads: leads.map(l => ({ id: l.id, firstName: l.first_name, lastName: l.last_name, email: l.email, phone: l.phone, zipCode: l.zip_code, state: l.state, insuranceType: l.insurance_type, createdAt: l.created_at })),
      appointments: appointments.map(a => ({ id: a.id, status: a.status, scheduledDate: a.scheduled_date, outcome: a.outcome, createdAt: a.created_at })),
      consentRecords: consentEvents.length,
      exportedAt: new Date().toISOString(),
    })
  })

  // POST /api/compliance/data-delete - CCPA deletion
  router.post('/data-delete', requireAuth, (req, res) => {
    const { email } = req.body
    const searchEmail = email || req.user.email

    const leads = db.prepare('SELECT id FROM qade_leads WHERE email = ?').all(searchEmail)

    // Anonymize PII but keep statistical data
    leads.forEach(l => {
      db.prepare(`UPDATE qade_leads SET
        first_name = 'DELETED', last_name = 'DELETED',
        email = 'deleted@deleted.com', phone = '0000000000',
        tcpa_consent_ip = NULL, suppressed_at = datetime('now'),
        updated_at = datetime('now')
        WHERE id = ?`).run(l.id)
    })

    // Log the deletion
    db.prepare('INSERT INTO compliance_events (id, event_type, entity_type, entity_id, actor_id, actor_role, detail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))').run(
      uuid(), 'data_delete', 'user', req.user.id, req.user.id, req.user.role,
      JSON.stringify({ deletedEmail: searchEmail, leadsAnonymized: leads.length })
    )

    res.json({ ok: true, leadsAnonymized: leads.length, deletedAt: new Date().toISOString() })
  })

  return router
}
