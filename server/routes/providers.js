import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

export default function providerRoutes(db) {
  const router = Router()

  // GET /api/providers - list with filters
  router.get('/', optionalAuth, (req, res) => {
    const { category, available, search, sort, lat, lng } = req.query

    let where = []
    let params = []

    if (category && category !== 'All') {
      where.push('p.category = ?')
      params.push(category)
    }
    if (available === 'true') {
      where.push('p.available = 1')
    }
    if (search) {
      where.push('(p.business_name LIKE ? OR p.category LIKE ? OR p.description LIKE ?)')
      const term = `%${search}%`
      params.push(term, term, term)
    }

    const whereClause = where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''

    let orderBy = 'ORDER BY p.available DESC, p.rating DESC'
    if (sort === 'distance') orderBy = 'ORDER BY p.distance ASC'
    else if (sort === 'rating') orderBy = 'ORDER BY p.rating DESC'
    else if (sort === 'price') orderBy = 'ORDER BY p.hourly_rate ASC'
    else if (sort === 'reviews') orderBy = 'ORDER BY p.review_count DESC'

    const providers = db.prepare(`
      SELECT p.*, u.email as user_email
      FROM providers p
      JOIN users u ON p.user_id = u.id
      ${whereClause}
      ${orderBy}
    `).all(...params)

    // Fetch services for each provider
    const getServices = db.prepare('SELECT name FROM provider_services WHERE provider_id = ?')
    const getHours = db.prepare('SELECT * FROM provider_hours WHERE provider_id = ? ORDER BY day_of_week')

    const result = providers.map(p => {
      const services = getServices.all(p.id).map(s => s.name)
      const hoursRows = getHours.all(p.id)

      // Convert hours to original format
      const openDays = hoursRows.filter(h => !h.is_closed)
      let hoursObj = { open: '8:00 AM', close: '5:00 PM', days: 'Mon-Fri' }
      if (openDays.length > 0) {
        hoursObj.open = openDays[0].open_time || '8:00 AM'
        hoursObj.close = openDays[0].close_time || '5:00 PM'
        if (openDays.length === 7) hoursObj.days = 'Mon-Sun'
        else if (openDays.length === 6) hoursObj.days = 'Mon-Sat'
        else hoursObj.days = 'Mon-Fri'
      }

      return {
        id: p.id,
        name: p.business_name,
        category: p.category,
        avatar: null,
        available: !!p.available,
        rating: p.rating,
        reviewCount: p.review_count,
        responseTime: p.response_time,
        hourlyRate: p.hourly_rate,
        description: p.description,
        services,
        hours: hoursObj,
        location: { lat: p.lat, lng: p.lng, address: p.address },
        distance: p.distance,
        phone: p.phone,
        favoriteCount: p.favorite_count,
        portfolio: [],
        reviews: [],
        blog: [],
        media: [],
      }
    })

    res.json(result)
  })

  // GET /api/providers/:id - full detail
  router.get('/:id', optionalAuth, (req, res) => {
    const p = db.prepare(`
      SELECT p.*, u.email as user_email
      FROM providers p JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).get(req.params.id)

    if (!p) return res.status(404).json({ error: 'Provider not found' })

    const services = db.prepare('SELECT name FROM provider_services WHERE provider_id = ?').all(p.id).map(s => s.name)
    const portfolio = db.prepare('SELECT * FROM provider_portfolio WHERE provider_id = ? ORDER BY date DESC').all(p.id).map(item => ({
      id: item.id, title: item.title, description: item.description, service: item.service, date: item.date,
      beforeColor: item.before_color, afterColor: item.after_color, beforeLabel: item.before_label, afterLabel: item.after_label,
    }))
    const reviews = db.prepare('SELECT * FROM provider_reviews WHERE provider_id = ? ORDER BY date DESC').all(p.id).map(r => ({
      id: r.id, user: r.user_name, rating: r.rating, text: r.text, date: r.date,
    }))
    const blog = db.prepare('SELECT * FROM provider_blog WHERE provider_id = ? AND published = 1 ORDER BY created_at DESC').all(p.id).map(b => ({
      id: b.id, title: b.title, excerpt: b.excerpt, date: b.created_at,
    }))
    const media = db.prepare('SELECT * FROM provider_media WHERE provider_id = ? ORDER BY created_at DESC').all(p.id).map(m => ({
      id: m.id, type: m.type, title: m.title, url: m.url,
    }))
    const hoursRows = db.prepare('SELECT * FROM provider_hours WHERE provider_id = ? ORDER BY day_of_week').all(p.id)
    const openDays = hoursRows.filter(h => !h.is_closed)
    let hoursObj = { open: '8:00 AM', close: '5:00 PM', days: 'Mon-Fri' }
    if (openDays.length > 0) {
      hoursObj.open = openDays[0].open_time || '8:00 AM'
      hoursObj.close = openDays[0].close_time || '5:00 PM'
      if (openDays.length === 7) hoursObj.days = 'Mon-Sun'
      else if (openDays.length === 6) hoursObj.days = 'Mon-Sat'
      else hoursObj.days = 'Mon-Fri'
    }

    res.json({
      id: p.id, name: p.business_name, category: p.category, avatar: null,
      available: !!p.available, rating: p.rating, reviewCount: p.review_count,
      responseTime: p.response_time, hourlyRate: p.hourly_rate, description: p.description,
      services, hours: hoursObj,
      location: { lat: p.lat, lng: p.lng, address: p.address },
      distance: p.distance, phone: p.phone, favoriteCount: p.favorite_count,
      portfolio, reviews, blog, media,
    })
  })

  // PUT /api/providers/:id/availability
  router.put('/:id/availability', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT * FROM providers WHERE id = ?').get(req.params.id)
    if (!provider) return res.status(404).json({ error: 'Provider not found' })

    const newAvailable = provider.available ? 0 : 1
    db.prepare('UPDATE providers SET available = ?, updated_at = datetime("now") WHERE id = ?').run(newAvailable, req.params.id)

    res.json({ id: req.params.id, available: !!newAvailable })
  })

  // PUT /api/providers/:id - update profile
  router.put('/:id', requireAuth, (req, res) => {
    const { business_name, category, description, hourly_rate, phone, response_time, lat, lng, address, service_radius } = req.body
    const provider = db.prepare('SELECT * FROM providers WHERE id = ?').get(req.params.id)
    if (!provider) return res.status(404).json({ error: 'Provider not found' })

    db.prepare(`UPDATE providers SET
      business_name = COALESCE(?, business_name),
      category = COALESCE(?, category),
      description = COALESCE(?, description),
      hourly_rate = COALESCE(?, hourly_rate),
      phone = COALESCE(?, phone),
      response_time = COALESCE(?, response_time),
      lat = COALESCE(?, lat),
      lng = COALESCE(?, lng),
      address = COALESCE(?, address),
      service_radius = COALESCE(?, service_radius),
      updated_at = datetime('now')
    WHERE id = ?`).run(
      business_name, category, description, hourly_rate, phone,
      response_time, lat, lng, address, service_radius, req.params.id
    )

    res.json({ ok: true })
  })

  // POST /api/providers/:id/services
  router.post('/:id/services', requireAuth, (req, res) => {
    const { name, description, price, duration_minutes } = req.body
    if (!name) return res.status(400).json({ error: 'Service name is required' })

    const id = uuid()
    db.prepare('INSERT INTO provider_services (id, provider_id, name, description, price, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)').run(
      id, req.params.id, name, description || null, price || null, duration_minutes || null
    )
    res.json({ id, name })
  })

  // DELETE /api/providers/:id/services/:sid
  router.delete('/:id/services/:sid', requireAuth, (req, res) => {
    db.prepare('DELETE FROM provider_services WHERE id = ? AND provider_id = ?').run(req.params.sid, req.params.id)
    res.json({ ok: true })
  })

  // POST /api/providers/:id/blog
  router.post('/:id/blog', requireAuth, (req, res) => {
    const { title, content, excerpt } = req.body
    if (!title) return res.status(400).json({ error: 'Title is required' })

    const id = uuid()
    db.prepare('INSERT INTO provider_blog (id, provider_id, title, content, excerpt, published) VALUES (?, ?, ?, ?, ?, 1)').run(
      id, req.params.id, title, content || '', excerpt || content?.substring(0, 150) || ''
    )
    res.json({ id, title })
  })

  // POST /api/providers/:id/portfolio
  router.post('/:id/portfolio', requireAuth, (req, res) => {
    const { title, description, service, beforeLabel, afterLabel, beforeColor, afterColor } = req.body
    const id = uuid()
    const date = new Date().toISOString().split('T')[0]
    db.prepare(`INSERT INTO provider_portfolio (id, provider_id, title, description, service, date, before_label, after_label, before_color, after_color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, req.params.id, title, description, service, date, beforeLabel, afterLabel, beforeColor, afterColor
    )
    res.json({ id, title })
  })

  // GET /api/providers/me/dashboard - provider's own dashboard data
  router.get('/me/dashboard', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT * FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' })

    const services = db.prepare('SELECT * FROM provider_services WHERE provider_id = ?').all(provider.id)
    const bookings = db.prepare(`SELECT * FROM bookings WHERE provider_id = ? ORDER BY date DESC, start_time ASC`).all(provider.id)
    const payouts = db.prepare('SELECT * FROM payouts WHERE provider_id = ? ORDER BY created_at DESC').all(provider.id)
    const deals = db.prepare('SELECT * FROM deals WHERE provider_id = ? ORDER BY created_at DESC').all(provider.id)

    // Compute earnings
    const payments = db.prepare(`SELECT * FROM payments WHERE provider_id = ? AND status = 'completed'`).all(provider.id)
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)

    res.json({
      provider: {
        id: provider.id, name: provider.business_name, category: provider.category,
        available: !!provider.available, hourlyRate: provider.hourly_rate,
        rating: provider.rating, reviewCount: provider.review_count,
        responseTime: provider.response_time, phone: provider.phone,
      },
      services: services.map(s => ({ id: s.id, name: s.name, price: s.price })),
      bookings: bookings.map(b => ({
        id: b.id, customer: b.customer_id, service: b.service_name,
        date: b.date, startTime: b.start_time, endTime: b.end_time,
        status: b.status, notes: b.notes, amount: b.total_amount,
      })),
      payouts: payouts.map(p => ({
        id: p.id, date: p.created_at, amount: p.amount,
        status: p.status, method: p.method,
      })),
      deals: deals.map(d => ({
        id: d.id, title: d.title, description: d.description,
        originalPrice: d.original_price, dealPrice: d.deal_price,
        percentOff: d.percent_off, maxClaims: d.max_claims,
        claimedCount: d.claimed_count, active: !!d.active,
      })),
      earnings: {
        totalRevenue,
        totalJobs: bookings.filter(b => b.status === 'completed').length,
        avgJobValue: bookings.length > 0 ? Math.round(totalRevenue / Math.max(bookings.filter(b => b.status === 'completed').length, 1)) : 0,
      },
    })
  })

  return router
}
