import { Router } from 'express'

const SERVICE_CATEGORIES = [
  'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Landscaping', 'Painting',
  'Roofing', 'Auto Repair', 'Pest Control', 'Moving', 'Handyman', 'Locksmith'
]

export default function searchRoutes(db) {
  const router = Router()

  // GET /api/search/autocomplete?q=
  router.get('/autocomplete', (req, res) => {
    const { q } = req.query
    if (!q || q.length < 2) return res.json({ providers: [], services: [], categories: [] })

    const term = `%${q}%`

    // Match providers
    const providers = db.prepare(`
      SELECT id, business_name as name, category FROM providers
      WHERE business_name LIKE ? OR category LIKE ? OR description LIKE ?
      LIMIT 4
    `).all(term, term, term)

    // Match services
    const serviceRows = db.prepare(`
      SELECT DISTINCT name FROM provider_services WHERE name LIKE ? LIMIT 4
    `).all(term)
    const services = serviceRows.map(s => s.name)

    // Match categories
    const categories = SERVICE_CATEGORIES.filter(c =>
      c.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 3)

    res.json({ providers, services, categories })
  })

  return router
}
