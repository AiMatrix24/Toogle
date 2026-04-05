import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth } from '../middleware/auth.js'

export default function providerConfigRoutes(db) {
  const router = Router()

  // ---- Licensing ----

  // GET /api/provider-config/licensing
  router.get('/licensing', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.json([])
    const licenses = db.prepare('SELECT * FROM provider_licensing WHERE provider_id = ? ORDER BY state_code').all(provider.id)
    res.json(licenses.map(l => ({
      id: l.id, stateCode: l.state_code, licenseNumber: l.license_number,
      npn: l.npn, linesOfAuthority: l.lines_of_authority ? JSON.parse(l.lines_of_authority) : [],
      status: l.license_status, expirationDate: l.expiration_date,
      eoInsuranceExpires: l.eo_insurance_expires, verified: !!l.verified,
    })))
  })

  // POST /api/provider-config/licensing
  router.post('/licensing', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.status(403).json({ error: 'Not a provider' })

    const { stateCode, licenseNumber, npn, linesOfAuthority, expirationDate, eoInsuranceExpires } = req.body
    if (!stateCode) return res.status(400).json({ error: 'State code is required' })

    const id = uuid()
    db.prepare(`INSERT INTO provider_licensing (id, provider_id, state_code, license_number, npn, lines_of_authority, expiration_date, eo_insurance_expires)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, provider.id, stateCode, licenseNumber || null, npn || null,
      linesOfAuthority ? JSON.stringify(linesOfAuthority) : null,
      expirationDate || null, eoInsuranceExpires || null
    )
    res.json({ id })
  })

  // PUT /api/provider-config/licensing/:id
  router.put('/licensing/:id', requireAuth, (req, res) => {
    const { stateCode, licenseNumber, npn, linesOfAuthority, status, expirationDate, eoInsuranceExpires } = req.body
    db.prepare(`UPDATE provider_licensing SET
      state_code = COALESCE(?, state_code), license_number = COALESCE(?, license_number),
      npn = COALESCE(?, npn), lines_of_authority = COALESCE(?, lines_of_authority),
      license_status = COALESCE(?, license_status), expiration_date = COALESCE(?, expiration_date),
      eo_insurance_expires = COALESCE(?, eo_insurance_expires)
      WHERE id = ?`).run(
      stateCode, licenseNumber, npn,
      linesOfAuthority ? JSON.stringify(linesOfAuthority) : null,
      status, expirationDate, eoInsuranceExpires, req.params.id
    )
    res.json({ ok: true })
  })

  // DELETE /api/provider-config/licensing/:id
  router.delete('/licensing/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM provider_licensing WHERE id = ?').run(req.params.id)
    res.json({ ok: true })
  })

  // ---- Capacity ----

  // GET /api/provider-config/capacity
  router.get('/capacity', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.status(403).json({ error: 'Not a provider' })

    let cap = db.prepare('SELECT * FROM appointment_capacity WHERE provider_id = ?').get(provider.id)
    if (!cap) {
      const id = uuid()
      db.prepare('INSERT INTO appointment_capacity (id, provider_id) VALUES (?, ?)').run(id, provider.id)
      cap = db.prepare('SELECT * FROM appointment_capacity WHERE id = ?').get(id)
    }

    res.json({
      dailyCap: cap.daily_cap, weeklyCap: cap.weekly_cap,
      currentDaily: cap.current_daily, currentWeekly: cap.current_weekly,
      autoPauseAtCap: !!cap.auto_pause_at_cap, acceptingAppointments: !!cap.accepting_appointments,
      preferredTypes: cap.preferred_types ? JSON.parse(cap.preferred_types) : [],
      minLeadScore: cap.min_lead_score, subscriptionTier: cap.subscription_tier,
    })
  })

  // PUT /api/provider-config/capacity
  router.put('/capacity', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.status(403).json({ error: 'Not a provider' })

    const { dailyCap, weeklyCap, autoPauseAtCap, acceptingAppointments, preferredTypes, minLeadScore } = req.body

    // Upsert
    db.prepare(`INSERT INTO appointment_capacity (id, provider_id, daily_cap, weekly_cap, auto_pause_at_cap, accepting_appointments, preferred_types, min_lead_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(provider_id) DO UPDATE SET
        daily_cap = COALESCE(excluded.daily_cap, daily_cap),
        weekly_cap = COALESCE(excluded.weekly_cap, weekly_cap),
        auto_pause_at_cap = COALESCE(excluded.auto_pause_at_cap, auto_pause_at_cap),
        accepting_appointments = COALESCE(excluded.accepting_appointments, accepting_appointments),
        preferred_types = COALESCE(excluded.preferred_types, preferred_types),
        min_lead_score = COALESCE(excluded.min_lead_score, min_lead_score),
        updated_at = datetime('now')`).run(
      uuid(), provider.id, dailyCap || 10, weeklyCap || 40,
      autoPauseAtCap !== undefined ? (autoPauseAtCap ? 1 : 0) : 1,
      acceptingAppointments !== undefined ? (acceptingAppointments ? 1 : 0) : 1,
      preferredTypes ? JSON.stringify(preferredTypes) : null,
      minLeadScore || 60
    )
    res.json({ ok: true })
  })

  // ---- Territories ----

  // GET /api/provider-config/territories
  router.get('/territories', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.json([])
    const territories = db.prepare('SELECT * FROM territory_exclusives WHERE provider_id = ? AND status = "active"').all(provider.id)
    res.json(territories.map(t => ({
      id: t.id, type: t.territory_type, value: t.territory_value,
      insuranceType: t.insurance_type, exclusive: !!t.exclusive,
      monthlyFee: t.monthly_fee, startDate: t.start_date, endDate: t.end_date,
    })))
  })

  // POST /api/provider-config/territories
  router.post('/territories', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.status(403).json({ error: 'Not a provider' })

    const { type, value, insuranceType, exclusive } = req.body
    if (!type || !value) return res.status(400).json({ error: 'Territory type and value required' })

    // Check subscription tier for territory limits
    const cap = db.prepare('SELECT subscription_tier FROM appointment_capacity WHERE provider_id = ?').get(provider.id)
    const tier = cap?.subscription_tier || 'starter'
    const existing = db.prepare('SELECT COUNT(*) as count FROM territory_exclusives WHERE provider_id = ? AND status = "active"').get(provider.id)

    const limits = { starter: 0, pro: 1, enterprise: 5 }
    if (existing.count >= limits[tier]) {
      return res.status(400).json({ error: `${tier} tier allows max ${limits[tier]} territories. Upgrade to add more.` })
    }

    const id = uuid()
    db.prepare(`INSERT INTO territory_exclusives (id, provider_id, territory_type, territory_value, insurance_type, exclusive, start_date)
      VALUES (?, ?, ?, ?, ?, ?, date('now'))`).run(
      id, provider.id, type, value, insuranceType || null, exclusive ? 1 : 0
    )
    res.json({ id })
  })

  return router
}
