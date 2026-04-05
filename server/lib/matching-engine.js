// Module 29: 5-Factor Appointment Matching Engine
// Availability 30%, Licensing 25%, Close Rate 20%, Speed 15%, Capacity 10%

export function findMatches(db, lead) {
  // Get all providers with active licenses in the lead's state for the lead's insurance type
  const licensedProviders = db.prepare(`
    SELECT DISTINCT p.id, p.business_name, p.available, p.rating, p.review_count, p.hourly_rate,
           pl.license_number, pl.lines_of_authority, pl.license_status
    FROM providers p
    JOIN provider_licensing pl ON p.id = pl.provider_id
    WHERE pl.state_code = ? AND pl.license_status = 'active'
  `).all(lead.state)

  if (licensedProviders.length === 0) return []

  const matches = licensedProviders.map(provider => {
    // Check lines of authority match
    const loa = provider.lines_of_authority ? JSON.parse(provider.lines_of_authority) : []
    const loaMatch = loa.includes(lead.insurance_type) || loa.length === 0 // empty = all types

    if (!loaMatch && loa.length > 0) return null

    // 1. Availability (30%)
    const capacity = db.prepare('SELECT * FROM appointment_capacity WHERE provider_id = ?').get(provider.id)
    let availabilityScore = 0
    if (capacity && capacity.accepting_appointments) {
      const dailyUsage = capacity.current_daily / capacity.daily_cap
      const weeklyUsage = capacity.current_weekly / capacity.weekly_cap
      availabilityScore = dailyUsage < 0.8 && weeklyUsage < 0.8 ? 100 : (1 - Math.max(dailyUsage, weeklyUsage)) * 100
    }

    // 2. Licensing (25%) - already filtered, but score by verification
    const licensingScore = provider.license_status === 'active' ? (provider.lines_of_authority ? 100 : 75) : 0

    // 3. Close Rate (20%)
    const outcomes = db.prepare(`
      SELECT COUNT(*) as total, SUM(CASE WHEN outcome = 'closed_sale' THEN 1 ELSE 0 END) as closed
      FROM qade_appointments WHERE provider_id = ? AND status = 'COMPLETED'
    `).get(provider.id)
    const closeRate = outcomes.total > 0 ? (outcomes.closed / outcomes.total) * 100 : 50 // default 50% for new

    // 4. Speed (15%) - average response time
    const speedData = db.prepare(`
      SELECT AVG(
        (julianday(accepted_at) - julianday(offered_at)) * 86400
      ) as avg_seconds
      FROM qade_appointments WHERE provider_id = ? AND accepted_at IS NOT NULL
    `).get(provider.id)
    const avgSeconds = speedData.avg_seconds || 30 // default 30s for new
    const speedScore = avgSeconds <= 15 ? 100 : avgSeconds <= 30 ? 85 : avgSeconds <= 60 ? 60 : 30

    // 5. Capacity (10%)
    const capacityScore = capacity ? ((capacity.daily_cap - capacity.current_daily) / capacity.daily_cap) * 100 : 50

    // Composite score
    const compositeScore = Math.round(
      availabilityScore * 0.30 +
      licensingScore * 0.25 +
      closeRate * 0.20 +
      speedScore * 0.15 +
      capacityScore * 0.10
    )

    return {
      providerId: provider.id,
      providerName: provider.business_name,
      compositeScore,
      factors: {
        availability: Math.round(availabilityScore),
        licensing: Math.round(licensingScore),
        closeRate: Math.round(closeRate),
        speed: Math.round(speedScore),
        capacity: Math.round(capacityScore),
      }
    }
  }).filter(Boolean)

  // Check for territory exclusives
  const exclusive = db.prepare(`
    SELECT provider_id FROM territory_exclusives
    WHERE territory_value = ? AND (insurance_type = ? OR insurance_type IS NULL)
    AND status = 'active' AND exclusive = 1
  `).get(lead.zip_code, lead.insurance_type)

  if (exclusive) {
    const exMatch = matches.find(m => m.providerId === exclusive.provider_id)
    if (exMatch) exMatch.exclusiveTier1 = true
  }

  return matches.sort((a, b) => {
    if (a.exclusiveTier1 && !b.exclusiveTier1) return -1
    if (!a.exclusiveTier1 && b.exclusiveTier1) return 1
    return b.compositeScore - a.compositeScore
  })
}
