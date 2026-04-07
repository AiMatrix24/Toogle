import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { createTables } from '../server/db/schema.js'
import { errorHandler } from '../server/middleware/error.js'

// Route imports
import authRoutes from '../server/routes/auth.js'
import providerRoutes from '../server/routes/providers.js'
import userRoutes from '../server/routes/users.js'
import bookingRoutes from '../server/routes/bookings.js'
import messageRoutes from '../server/routes/messages.js'
import notificationRoutes from '../server/routes/notifications.js'
import paymentRoutes from '../server/routes/payments.js'
import dealRoutes from '../server/routes/deals.js'
import reviewRoutes from '../server/routes/reviews.js'
import rewardRoutes from '../server/routes/rewards.js'
import referralRoutes from '../server/routes/referrals.js'
import analyticsRoutes from '../server/routes/analytics.js'
import searchRoutes from '../server/routes/search.js'
import supportRoutes from '../server/routes/support.js'
import adminRoutes from '../server/routes/admin.js'
import appointmentRoutes from '../server/routes/appointments.js'
import providerConfigRoutes from '../server/routes/provider-config.js'
import complianceRoutes from '../server/routes/compliance.js'
import policyUploadRoutes from '../server/routes/policy-upload.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

// Database — use /tmp for Vercel (writable) or local path for dev
const dbDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'server', 'db')
const dbPath = path.join(dbDir, 'toggle.db')
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Ensure tables exist
createTables(db)

// Seed if empty (for Vercel cold start with /tmp)
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count
if (userCount === 0) {
  // Inline minimal seed for Vercel — admin + demo customer + 2 providers
  const bcrypt = await import('bcryptjs')
  const { v4: uuid } = await import('uuid')
  const hash = bcrypt.default.hashSync('password123', 10)

  const customerId = uuid()
  db.prepare('INSERT INTO users (id, email, password_hash, name, phone, role, address, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    customerId, 'john@email.com', hash, 'John Doe', '(555) 999-0000', 'customer', '456 Oak Ave', 'Los Angeles', 'CA', '90012'
  )
  db.prepare('INSERT INTO users (id, email, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?, ?)').run(
    uuid(), 'admin@toggle.com', hash, 'Admin', '(555) 000-0000', 'admin'
  )

  // Two sample providers
  const providers = [
    { name: "Mike's Plumbing Pro", cat: 'Plumbing', rate: 85, avail: 1, resp: '< 15 min', lat: 34.0522, lng: -118.2437, dist: 1.2, phone: '(555) 123-4567', rating: 4.8, reviews: 234, email: 'mike@plumbingpro.com' },
    { name: 'Spark Electric Solutions', cat: 'Electrical', rate: 95, avail: 1, resp: '< 30 min', lat: 34.0625, lng: -118.2350, dist: 2.4, phone: '(555) 234-5678', rating: 4.9, reviews: 189, email: 'spark@electric.com' },
  ]
  providers.forEach(p => {
    const userId = uuid()
    const providerId = uuid()
    db.prepare('INSERT INTO users (id, email, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?, ?)').run(userId, p.email, hash, p.name, p.phone, 'provider')
    db.prepare('INSERT INTO providers (id, user_id, business_name, category, description, hourly_rate, phone, available, response_time, lat, lng, address, distance, rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      providerId, userId, p.name, p.cat, `Professional ${p.cat.toLowerCase()} services.`, p.rate, p.phone, p.avail, p.resp, p.lat, p.lng, 'Los Angeles, CA', p.dist, p.rating, p.reviews
    )
    db.prepare('INSERT INTO appointment_capacity (id, provider_id) VALUES (?, ?)').run(uuid(), providerId)
  })
}

// Middleware
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes(db))
app.use('/api/providers', providerRoutes(db))
app.use('/api/users', userRoutes(db))
app.use('/api/bookings', bookingRoutes(db))
app.use('/api/messages', messageRoutes(db))
app.use('/api/notifications', notificationRoutes(db))
app.use('/api/payments', paymentRoutes(db))
app.use('/api/deals', dealRoutes(db))
app.use('/api/reviews', reviewRoutes(db))
app.use('/api/rewards', rewardRoutes(db))
app.use('/api/referrals', referralRoutes(db))
app.use('/api/analytics', analyticsRoutes(db))
app.use('/api/search', searchRoutes(db))
app.use('/api/support', supportRoutes(db))
app.use('/api/admin', adminRoutes(db))
app.use('/api/appointments', appointmentRoutes(db))
app.use('/api/provider-config', providerConfigRoutes(db))
app.use('/api/compliance', complianceRoutes(db))
app.use('/api/policies', policyUploadRoutes(db))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.VERCEL ? 'vercel' : 'local' })
})

// Error handler
app.use(errorHandler)

export default app
