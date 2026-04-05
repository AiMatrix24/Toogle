import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth, optionalAuth, requireRole } from '../middleware/auth.js'
import { transition, canTransition } from '../lib/state-machine.js'
import { findMatches } from '../lib/matching-engine.js'
import { startDispatch, checkEscalation, getOfferedProviders } from '../lib/cascade-dispatch.js'
import { calculateFee } from '../lib/fee-calculator.js'

const now = () => new Date().toISOString()

// Qualification scoring (simulated)
function qualifyLead(lead) {
  let score = 0
  const breakdown = []

  // Required fields (+30)
  if (lead.first_name && lead.last_name && lead.phone && lead.email && lead.zip_code && lead.insurance_type) {
    score += 30; breakdown.push({ factor: 'required_fields', points: 30 })
  }

  // TCPA consent (+20)
  if (lead.tcpa_consent) {
    score += 20; breakdown.push({ factor: 'tcpa_consent', points: 20 })
  }

  // Valid phone format (+10)
  if (/^\d{10}$/.test(lead.phone.replace(/\D/g, ''))) {
    score += 10; breakdown.push({ factor: 'valid_phone', points: 10 })
  }

  // Valid email format (+10)
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    score += 10; breakdown.push({ factor: 'valid_email', points: 10 })
  }

  // Not a duplicate (+15) - checked separately
  // DNC clean (+15) - simulated as always passing

  return { score, breakdown }
}

export default function appointmentRoutes(db) {
  const router = Router()

  // ============================================================
  // PHASE 1: Lead Intake + Qualification
  // ============================================================

  // POST /api/appointments/leads - Submit new lead
  router.post('/leads', optionalAuth, (req, res) => {
    const { firstName, lastName, email, phone, zipCode, state, insuranceType, intentDescription, source, tcpaConsent } = req.body

    if (!firstName || !lastName || !email || !phone || !zipCode || !state || !insuranceType) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const leadId = uuid()
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown'

    // Check for duplicate within 90 days
    const phoneClean = phone.replace(/\D/g, '')
    const duplicate = db.prepare(`
      SELECT id FROM qade_leads
      WHERE (phone = ? OR email = ?) AND created_at > datetime('now', '-90 days')
      LIMIT 1
    `).get(phoneClean, email)

    // Run qualification
    const leadData = { first_name: firstName, last_name: lastName, email, phone: phoneClean, zip_code: zipCode, insurance_type: insuranceType, tcpa_consent: tcpaConsent ? 1 : 0 }
    let { score, breakdown } = qualifyLead(leadData)

    // Duplicate check (+15 if clean)
    if (!duplicate) {
      score += 15; breakdown.push({ factor: 'not_duplicate', points: 15 })
    } else {
      breakdown.push({ factor: 'duplicate_found', points: 0 })
    }

    // DNC check (+15, simulated as always passing)
    score += 15; breakdown.push({ factor: 'dnc_clean', points: 15 })

    const qualificationStage = score >= 60 ? 'final' : 'pending'

    // Insert lead
    db.prepare(`INSERT INTO qade_leads (id, first_name, last_name, email, phone, zip_code, state, insurance_type, intent_description, source, source_detail, tcpa_consent, tcpa_consent_timestamp, tcpa_consent_ip, tcpa_consent_language, dnc_checked, dnc_clean, duplicate_of_lead_id, qualification_score, qualification_stage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?)`).run(
      leadId, firstName, lastName, email, phoneClean, zipCode, state, insuranceType,
      intentDescription || null, source || 'web_form', null,
      tcpaConsent ? 1 : 0, tcpaConsent ? new Date().toISOString() : null, ip,
      tcpaConsent ? 'By submitting this form, I provide my prior express written consent to be contacted by Toggle and its network of licensed professionals.' : null,
      duplicate?.id || null, score, qualificationStage
    )

    // Create appointment record
    const appointmentId = uuid()
    const initialStatus = score >= 60 ? 'QUALIFIED' : 'SUBMITTED'
    db.prepare(`INSERT INTO qade_appointments (id, lead_id, status, consumer_user_id) VALUES (?, ?, ?, ?)`).run(
      appointmentId, leadId, initialStatus, req.user?.id || null
    )

    // Log consent to compliance_events
    if (tcpaConsent) {
      db.prepare('INSERT INTO compliance_events (id, event_type, entity_type, entity_id, actor_id, detail, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
        uuid(), 'consent_captured', 'lead', leadId, req.user?.id || null,
        JSON.stringify({ type: 'tcpa', language: 'standard', breakdown }), ip, now()
      )
    }

    // Log DNC check
    db.prepare('INSERT INTO compliance_events (id, event_type, entity_type, entity_id, detail, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
      uuid(), 'dnc_check', 'lead', leadId, JSON.stringify({ result: 'clean', simulated: true }), now()
    )

    res.json({
      leadId,
      appointmentId,
      qualificationScore: score,
      qualificationStage,
      status: initialStatus,
      breakdown,
    })
  })

  // GET /api/appointments/leads - Admin list leads
  router.get('/leads', requireAuth, requireRole('admin'), (req, res) => {
    const { status, source, insuranceType, minScore, maxScore, limit } = req.query
    let where = []
    let params = []

    if (status) { where.push('l.qualification_stage = ?'); params.push(status) }
    if (source) { where.push('l.source = ?'); params.push(source) }
    if (insuranceType) { where.push('l.insurance_type = ?'); params.push(insuranceType) }
    if (minScore) { where.push('l.qualification_score >= ?'); params.push(parseInt(minScore)) }
    if (maxScore) { where.push('l.qualification_score <= ?'); params.push(parseInt(maxScore)) }

    const leads = db.prepare(`
      SELECT l.*, a.id as appointment_id, a.status as appointment_status
      FROM qade_leads l
      LEFT JOIN qade_appointments a ON a.lead_id = l.id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY l.created_at DESC
      LIMIT ?
    `).all(...params, parseInt(limit) || 50)

    res.json(leads.map(l => ({
      id: l.id, firstName: l.first_name, lastName: l.last_name,
      email: l.email, phone: l.phone, zipCode: l.zip_code, state: l.state,
      insuranceType: l.insurance_type, source: l.source,
      qualificationScore: l.qualification_score, qualificationStage: l.qualification_stage,
      tcpaConsent: !!l.tcpa_consent, tcpaTimestamp: l.tcpa_consent_timestamp,
      duplicateOf: l.duplicate_of_lead_id,
      appointmentId: l.appointment_id, appointmentStatus: l.appointment_status,
      createdAt: l.created_at,
    })))
  })

  // GET /api/appointments/leads/:id - Lead detail
  router.get('/leads/:id', requireAuth, (req, res) => {
    const lead = db.prepare('SELECT * FROM qade_leads WHERE id = ?').get(req.params.id)
    if (!lead) return res.status(404).json({ error: 'Lead not found' })

    const appointment = db.prepare('SELECT * FROM qade_appointments WHERE lead_id = ?').get(lead.id)
    const events = db.prepare('SELECT * FROM compliance_events WHERE entity_id = ? ORDER BY created_at ASC').all(lead.id)

    res.json({
      lead: { ...lead, tcpa_consent: !!lead.tcpa_consent, dnc_checked: !!lead.dnc_checked, dnc_clean: !!lead.dnc_clean },
      appointment,
      complianceEvents: events,
    })
  })

  // ============================================================
  // PHASE 2: Matching + Dispatch
  // ============================================================

  // POST /api/appointments/:id/match - Run matching for qualified lead
  router.post('/:id/match', requireAuth, requireRole('admin'), (req, res) => {
    const appt = db.prepare('SELECT * FROM qade_appointments WHERE id = ?').get(req.params.id)
    if (!appt) return res.status(404).json({ error: 'Appointment not found' })

    const lead = db.prepare('SELECT * FROM qade_leads WHERE id = ?').get(appt.lead_id)
    if (!lead) return res.status(404).json({ error: 'Lead not found' })

    if (appt.status !== 'QUALIFIED' && appt.status !== 'MATCHING') {
      return res.status(400).json({ error: `Cannot match from status ${appt.status}` })
    }

    // Transition to MATCHING
    if (appt.status === 'QUALIFIED') {
      transition(db, appt.id, 'MATCHING', req.user.id, 'admin')
    }

    const matches = findMatches(db, lead)
    res.json({ appointmentId: appt.id, matches, totalMatches: matches.length })
  })

  // POST /api/appointments/:id/dispatch - Start cascade dispatch
  router.post('/:id/dispatch', requireAuth, requireRole('admin'), (req, res) => {
    const appt = db.prepare('SELECT * FROM qade_appointments WHERE id = ?').get(req.params.id)
    if (!appt) return res.status(404).json({ error: 'Appointment not found' })

    const lead = db.prepare('SELECT * FROM qade_leads WHERE id = ?').get(appt.lead_id)
    const matches = findMatches(db, lead)

    if (matches.length === 0) {
      return res.json({ ok: false, reason: 'No eligible providers found' })
    }

    const result = startDispatch(db, appt.id, matches)
    res.json(result)
  })

  // POST /api/appointments/:id/respond - Provider accept/decline
  router.post('/:id/respond', requireAuth, (req, res) => {
    const { action } = req.body // 'accept' or 'decline'
    const appt = db.prepare('SELECT * FROM qade_appointments WHERE id = ?').get(req.params.id)
    if (!appt) return res.status(404).json({ error: 'Appointment not found' })
    if (appt.status !== 'OFFERED') return res.status(400).json({ error: 'Appointment is not in OFFERED state' })

    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.status(403).json({ error: 'Not a provider' })

    if (action === 'accept') {
      const lead = db.prepare('SELECT * FROM qade_leads WHERE id = ?').get(appt.lead_id)
      const fee = calculateFee(db, lead, provider.id, appt.tier_offered)

      db.prepare(`UPDATE qade_appointments SET
        provider_id = ?, status = 'ACCEPTED', accepted_at = datetime('now'),
        appointment_fee = ?, fee_status = 'charged',
        updated_at = datetime('now')
        WHERE id = ?`).run(provider.id, fee.finalFee, appt.id)

      // Update capacity
      db.prepare('UPDATE appointment_capacity SET current_daily = current_daily + 1, current_weekly = current_weekly + 1 WHERE provider_id = ?').run(provider.id)

      // Transition to SCHEDULING
      transition(db, appt.id, 'SCHEDULING', req.user.id, 'provider', { fee })

      // Log compliance
      db.prepare('INSERT INTO compliance_events (id, event_type, entity_type, entity_id, actor_id, actor_role, detail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
        uuid(), 'appointment_accepted', 'appointment', appt.id, req.user.id, 'provider',
        JSON.stringify({ providerId: provider.id, fee: fee.finalFee, tier: appt.tier_offered }), now()
      )

      return res.json({ ok: true, status: 'ACCEPTED', fee })
    }

    if (action === 'decline') {
      // Re-enter matching for next cascade tier
      const escalation = checkEscalation(db, appt.id)
      return res.json({ ok: true, declined: true, escalation })
    }

    res.status(400).json({ error: 'Action must be accept or decline' })
  })

  // GET /api/appointments/offered - Provider's pending offers
  router.get('/offered', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.json([])

    // Get all OFFERED appointments where this provider is in the current tier
    const offered = db.prepare(`
      SELECT a.*, l.first_name, l.last_name, l.insurance_type, l.zip_code, l.state, l.qualification_score
      FROM qade_appointments a
      JOIN qade_leads l ON a.lead_id = l.id
      WHERE a.status = 'OFFERED'
      ORDER BY a.offered_at DESC
    `).all()

    // Filter to only those where provider is in the current tier's match list
    const myOffers = offered.filter(appt => {
      const providers = getOfferedProviders(db, appt.id)
      return providers.some(p => p.providerId === provider.id)
    }).map(a => ({
      id: a.id, insuranceType: a.insurance_type, zip: a.zip_code, state: a.state,
      qualificationScore: a.qualification_score,
      tier: a.tier_offered, offeredAt: a.offered_at,
      estimatedFee: calculateFee(db, { insurance_type: a.insurance_type, zip_code: a.zip_code }, provider.id, a.tier_offered).finalFee,
    }))

    res.json(myOffers)
  })

  // ============================================================
  // PHASE 3: Scheduling + Execution + Outcomes
  // ============================================================

  // GET /api/appointments/mine - Consumer's appointments
  router.get('/mine', requireAuth, (req, res) => {
    const appts = db.prepare(`
      SELECT a.*, l.first_name, l.last_name, l.insurance_type, l.zip_code,
             p.business_name as provider_name
      FROM qade_appointments a
      JOIN qade_leads l ON a.lead_id = l.id
      LEFT JOIN providers p ON a.provider_id = p.id
      WHERE a.consumer_user_id = ?
      ORDER BY a.created_at DESC
    `).all(req.user.id)

    res.json(appts.map(a => ({
      id: a.id, status: a.status, insuranceType: a.insurance_type,
      providerName: a.provider_name, scheduledDate: a.scheduled_date,
      scheduledStart: a.scheduled_start, appointmentType: a.appointment_type,
      outcome: a.outcome, satisfaction: a.consumer_satisfaction,
      createdAt: a.created_at,
    })))
  })

  // GET /api/appointments/provider-queue - Provider's appointments
  router.get('/provider-queue', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.json([])

    const appts = db.prepare(`
      SELECT a.*, l.first_name, l.last_name, l.insurance_type, l.zip_code, l.state, l.phone, l.email, l.qualification_score
      FROM qade_appointments a
      JOIN qade_leads l ON a.lead_id = l.id
      WHERE a.provider_id = ? AND a.status NOT IN ('CANCELLED', 'NO_SHOW')
      ORDER BY a.scheduled_date ASC, a.scheduled_start ASC
    `).all(provider.id)

    res.json(appts.map(a => ({
      id: a.id, status: a.status, firstName: a.first_name, lastName: a.last_name,
      insuranceType: a.insurance_type, zip: a.zip_code, state: a.state,
      phone: a.phone, email: a.email, qualificationScore: a.qualification_score,
      scheduledDate: a.scheduled_date, scheduledStart: a.scheduled_start,
      scheduledEnd: a.scheduled_end, appointmentType: a.appointment_type,
      fee: a.appointment_fee, outcome: a.outcome,
      actualDuration: a.actual_duration_minutes, createdAt: a.created_at,
    })))
  })

  // POST /api/appointments/:id/schedule - Consumer selects time
  router.post('/:id/schedule', requireAuth, (req, res) => {
    const { date, startTime, endTime, appointmentType } = req.body
    const appt = db.prepare('SELECT * FROM qade_appointments WHERE id = ?').get(req.params.id)
    if (!appt) return res.status(404).json({ error: 'Appointment not found' })

    db.prepare(`UPDATE qade_appointments SET
      scheduled_date = ?, scheduled_start = ?, scheduled_end = ?,
      appointment_type = COALESCE(?, appointment_type),
      status = 'CONFIRMED', updated_at = datetime('now')
      WHERE id = ?`).run(date, startTime, endTime || null, appointmentType, req.params.id)

    transition(db, req.params.id, 'CONFIRMED', req.user.id, req.user.role, { date, startTime })
    res.json({ ok: true, status: 'CONFIRMED' })
  })

  // POST /api/appointments/:id/start - Provider starts appointment
  router.post('/:id/start', requireAuth, (req, res) => {
    transition(db, req.params.id, 'IN_PROGRESS', req.user.id, 'provider')
    db.prepare('UPDATE qade_appointments SET actual_start = datetime("now"), updated_at = datetime("now") WHERE id = ?').run(req.params.id)
    res.json({ ok: true, status: 'IN_PROGRESS' })
  })

  // POST /api/appointments/:id/complete - Provider completes
  router.post('/:id/complete', requireAuth, (req, res) => {
    const appt = db.prepare('SELECT actual_start FROM qade_appointments WHERE id = ?').get(req.params.id)
    const durationMinutes = appt?.actual_start
      ? Math.round((Date.now() - new Date(appt.actual_start + 'Z').getTime()) / 60000)
      : 0

    transition(db, req.params.id, 'COMPLETED', req.user.id, 'provider')
    db.prepare('UPDATE qade_appointments SET actual_end = datetime("now"), actual_duration_minutes = ?, updated_at = datetime("now") WHERE id = ?').run(durationMinutes, req.params.id)
    res.json({ ok: true, status: 'COMPLETED', durationMinutes })
  })

  // POST /api/appointments/:id/no-show - Provider marks no-show
  router.post('/:id/no-show', requireAuth, (req, res) => {
    transition(db, req.params.id, 'NO_SHOW', req.user.id, 'provider')
    db.prepare('UPDATE qade_appointments SET outcome = "no_show", fee_status = "credited", updated_at = datetime("now") WHERE id = ?').run(req.params.id)
    res.json({ ok: true, status: 'NO_SHOW' })
  })

  // POST /api/appointments/:id/cancel
  router.post('/:id/cancel', requireAuth, (req, res) => {
    const { reason } = req.body
    const cancelledBy = req.user.role === 'provider' ? 'provider' : 'consumer'
    transition(db, req.params.id, 'CANCELLED', req.user.id, req.user.role, { reason })
    db.prepare('UPDATE qade_appointments SET cancellation_reason = ?, cancelled_by = ?, updated_at = datetime("now") WHERE id = ?').run(reason || null, cancelledBy, req.params.id)
    res.json({ ok: true, status: 'CANCELLED' })
  })

  // POST /api/appointments/:id/outcome - Provider logs outcome
  router.post('/:id/outcome', requireAuth, (req, res) => {
    const { outcome, notes, policyType, estimatedPremium, leadQuality, leadQualityNotes } = req.body
    db.prepare(`UPDATE qade_appointments SET
      outcome = ?, outcome_notes = ?, policy_type = ?, estimated_premium = ?,
      provider_lead_quality = ?, provider_lead_quality_notes = ?,
      updated_at = datetime('now')
      WHERE id = ?`).run(outcome, notes || null, policyType || null, estimatedPremium || null, leadQuality || null, leadQualityNotes || null, req.params.id)
    res.json({ ok: true })
  })

  // POST /api/appointments/:id/survey - Consumer satisfaction
  router.post('/:id/survey', requireAuth, (req, res) => {
    const { rating, feedback } = req.body
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' })
    db.prepare('UPDATE qade_appointments SET consumer_satisfaction = ?, satisfaction_feedback = ?, updated_at = datetime("now") WHERE id = ?').run(rating, feedback || null, req.params.id)
    res.json({ ok: true })
  })

  // ============================================================
  // PHASE 4: Analytics + Full appointment detail
  // ============================================================

  // GET /api/appointments/:id - Full detail
  router.get('/:id', requireAuth, (req, res) => {
    const appt = db.prepare(`
      SELECT a.*, l.first_name, l.last_name, l.insurance_type, l.zip_code, l.state,
             l.email as consumer_email, l.phone as consumer_phone, l.qualification_score,
             p.business_name as provider_name
      FROM qade_appointments a
      JOIN qade_leads l ON a.lead_id = l.id
      LEFT JOIN providers p ON a.provider_id = p.id
      WHERE a.id = ?
    `).get(req.params.id)
    if (!appt) return res.status(404).json({ error: 'Appointment not found' })

    const events = db.prepare('SELECT * FROM compliance_events WHERE entity_id = ? ORDER BY created_at ASC').all(appt.id)

    res.json({ ...appt, complianceEvents: events })
  })

  // GET /api/appointments/analytics/summary - QADE metrics
  router.get('/analytics/summary', requireAuth, requireRole('admin'), (req, res) => {
    const totalLeads = db.prepare('SELECT COUNT(*) as count FROM qade_leads').get().count
    const qualifiedLeads = db.prepare("SELECT COUNT(*) as count FROM qade_leads WHERE qualification_stage = 'final'").get().count
    const totalAppointments = db.prepare('SELECT COUNT(*) as count FROM qade_appointments').get().count
    const completed = db.prepare("SELECT COUNT(*) as count FROM qade_appointments WHERE status = 'COMPLETED'").get().count
    const closedSales = db.prepare("SELECT COUNT(*) as count FROM qade_appointments WHERE outcome = 'closed_sale'").get().count
    const totalFees = db.prepare("SELECT COALESCE(SUM(appointment_fee), 0) as total FROM qade_appointments WHERE fee_status = 'charged'").get().total
    const avgScore = db.prepare('SELECT AVG(qualification_score) as avg FROM qade_leads').get().avg || 0
    const avgSatisfaction = db.prepare('SELECT AVG(consumer_satisfaction) as avg FROM qade_appointments WHERE consumer_satisfaction IS NOT NULL').get().avg || 0

    res.json({
      totalLeads, qualifiedLeads, totalAppointments, completed, closedSales, totalFees,
      avgScore: Math.round(avgScore), avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
      qualificationRate: totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0,
      closeRate: completed > 0 ? Math.round((closedSales / completed) * 100) : 0,
    })
  })

  return router
}
