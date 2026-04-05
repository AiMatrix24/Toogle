// Module 29: Fee calculation with modifiers

const BASE_FEES = {
  medicare: 25,
  health: 20,
  life: 20,
  auto: 15,
  home: 15,
  commercial: 25,
}

const TIER_DISCOUNTS = {
  starter: 0,
  pro: 0.10,      // 10% off
  enterprise: 0.20, // 20% off
}

export function calculateFee(db, lead, providerId, tier) {
  const baseFee = BASE_FEES[lead.insurance_type] || 20

  let fee = baseFee
  let modifiers = []

  // Territory exclusive holder discount
  const exclusive = db.prepare(`
    SELECT id FROM territory_exclusives
    WHERE provider_id = ? AND territory_value = ? AND status = 'active' AND exclusive = 1
  `).get(providerId, lead.zip_code)

  if (exclusive) {
    fee -= 5
    modifiers.push({ type: 'territory_exclusive', amount: -5 })
  }

  // Late-tier dispatch discount (Tier 4-5)
  if (tier >= 4) {
    fee -= 3
    modifiers.push({ type: 'late_tier', amount: -3 })
  }

  // Subscription tier discount
  const capacity = db.prepare('SELECT subscription_tier FROM appointment_capacity WHERE provider_id = ?').get(providerId)
  const subTier = capacity?.subscription_tier || 'starter'
  const discount = TIER_DISCOUNTS[subTier]
  if (discount > 0) {
    const discountAmount = Math.round(fee * discount * 100) / 100
    fee -= discountAmount
    modifiers.push({ type: `${subTier}_discount`, amount: -discountAmount })
  }

  return {
    baseFee,
    finalFee: Math.max(fee, 0),
    insuranceType: lead.insurance_type,
    modifiers,
  }
}
