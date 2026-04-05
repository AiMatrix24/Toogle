import { v4 as uuid } from 'uuid'

// Valid state transitions for QADE appointments
const TRANSITIONS = {
  SUBMITTED: ['QUALIFYING'],
  QUALIFYING: ['QUALIFIED', 'CANCELLED'],
  QUALIFIED: ['MATCHING'],
  MATCHING: ['OFFERED', 'CANCELLED'],
  OFFERED: ['ACCEPTED', 'MATCHING'], // MATCHING = re-match on decline/timeout
  ACCEPTED: ['SCHEDULING'],
  SCHEDULING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'NO_SHOW', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  NO_SHOW: [],
  CANCELLED: [],
}

export function canTransition(currentState, newState) {
  return TRANSITIONS[currentState]?.includes(newState) || false
}

export function transition(db, appointmentId, newState, actorId, actorRole, detail) {
  const appointment = db.prepare('SELECT status FROM qade_appointments WHERE id = ?').get(appointmentId)
  if (!appointment) throw Object.assign(new Error('Appointment not found'), { status: 404 })

  const currentState = appointment.status
  if (!canTransition(currentState, newState)) {
    throw Object.assign(
      new Error(`Invalid transition: ${currentState} → ${newState}`),
      { status: 400 }
    )
  }

  // Update appointment status
  db.prepare('UPDATE qade_appointments SET status = ?, updated_at = datetime("now") WHERE id = ?').run(newState, appointmentId)

  // Log to compliance_events
  db.prepare('INSERT INTO compliance_events (id, event_type, entity_type, entity_id, actor_id, actor_role, detail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))').run(
    uuid(), `state_${currentState}_to_${newState}`, 'appointment', appointmentId,
    actorId || null, actorRole || null, detail ? JSON.stringify(detail) : null
  )

  return { ok: true, previousState: currentState, newState }
}

export function getTransitions(state) {
  return TRANSITIONS[state] || []
}
