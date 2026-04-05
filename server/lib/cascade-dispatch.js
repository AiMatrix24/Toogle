import { v4 as uuid } from 'uuid'

// Cascade dispatch: 5 tiers with 60-second windows
export function startDispatch(db, appointmentId, rankedMatches) {
  if (rankedMatches.length === 0) return { ok: false, reason: 'No eligible providers' }

  // Assign tier 1 providers
  const tier1 = rankedMatches.filter(m => m.exclusiveTier1).length > 0
    ? rankedMatches.filter(m => m.exclusiveTier1)
    : rankedMatches.slice(0, 1)

  db.prepare(`UPDATE qade_appointments SET
    status = 'OFFERED', tier_offered = 1, offered_at = datetime('now'),
    cascade_depth = ?, updated_at = datetime('now')
    WHERE id = ?`).run(rankedMatches.length, appointmentId)

  // Store the match results for the dispatch cycle
  db.prepare('DELETE FROM compliance_events WHERE entity_id = ? AND event_type = "dispatch_matches"').run(appointmentId)
  db.prepare('INSERT INTO compliance_events (id, event_type, entity_type, entity_id, detail, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))').run(
    uuid(), 'dispatch_matches', 'appointment', appointmentId,
    JSON.stringify({ tier: 1, providers: tier1.map(m => m.providerId), allMatches: rankedMatches })
  )

  return { ok: true, tier: 1, providers: tier1 }
}

export function checkEscalation(db, appointmentId) {
  const appt = db.prepare('SELECT * FROM qade_appointments WHERE id = ?').get(appointmentId)
  if (!appt || appt.status !== 'OFFERED') return { escalated: false }

  const offeredAt = new Date(appt.offered_at + 'Z')
  const now = new Date()
  const elapsed = (now - offeredAt) / 1000

  if (elapsed < 60) return { escalated: false, secondsRemaining: Math.ceil(60 - elapsed) }

  // Escalate to next tier
  const currentTier = appt.tier_offered
  if (currentTier >= 5) {
    // All tiers exhausted — go back to MATCHING for admin review
    db.prepare('UPDATE qade_appointments SET status = "MATCHING", updated_at = datetime("now") WHERE id = ?').run(appointmentId)
    return { escalated: true, exhausted: true, message: 'All tiers exhausted, requires admin review' }
  }

  const newTier = currentTier + 1
  db.prepare(`UPDATE qade_appointments SET tier_offered = ?, offered_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`).run(newTier, appointmentId)

  // Log escalation
  db.prepare('INSERT INTO compliance_events (id, event_type, entity_type, entity_id, detail, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))').run(
    uuid(), 'dispatch_escalation', 'appointment', appointmentId,
    JSON.stringify({ fromTier: currentTier, toTier: newTier })
  )

  return { escalated: true, newTier, exhausted: false }
}

// Get providers for current dispatch tier
export function getOfferedProviders(db, appointmentId) {
  const appt = db.prepare('SELECT * FROM qade_appointments WHERE id = ?').get(appointmentId)
  if (!appt || appt.status !== 'OFFERED') return []

  // Retrieve stored matches
  const matchEvent = db.prepare(`
    SELECT detail FROM compliance_events
    WHERE entity_id = ? AND event_type = 'dispatch_matches'
    ORDER BY created_at DESC LIMIT 1
  `).get(appointmentId)

  if (!matchEvent) return []

  const { allMatches } = JSON.parse(matchEvent.detail)
  const tier = appt.tier_offered

  // Tier sizing: 1=top1/exclusive, 2=top3, 3=score>70, 4=score>50, 5=all
  switch (tier) {
    case 1: return allMatches.filter(m => m.exclusiveTier1).length > 0
      ? allMatches.filter(m => m.exclusiveTier1) : allMatches.slice(0, 1)
    case 2: return allMatches.slice(0, 3)
    case 3: return allMatches.filter(m => m.compositeScore > 70)
    case 4: return allMatches.filter(m => m.compositeScore > 50)
    case 5: return allMatches
    default: return allMatches.slice(0, 1)
  }
}
