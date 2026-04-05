import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { createTables } from './db/schema.js'
import { errorHandler } from './middleware/error.js'

// Route imports
import authRoutes from './routes/auth.js'
import providerRoutes from './routes/providers.js'
import userRoutes from './routes/users.js'
import bookingRoutes from './routes/bookings.js'
import messageRoutes from './routes/messages.js'
import notificationRoutes from './routes/notifications.js'
import paymentRoutes from './routes/payments.js'
import dealRoutes from './routes/deals.js'
import reviewRoutes from './routes/reviews.js'
import rewardRoutes from './routes/rewards.js'
import referralRoutes from './routes/referrals.js'
import analyticsRoutes from './routes/analytics.js'
import searchRoutes from './routes/search.js'
import supportRoutes from './routes/support.js'
import adminRoutes from './routes/admin.js'
import appointmentRoutes from './routes/appointments.js'
import providerConfigRoutes from './routes/provider-config.js'
import complianceRoutes from './routes/compliance.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

// Database
const dbPath = path.join(__dirname, 'db', 'toggle.db')
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Ensure tables exist
createTables(db)

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Toggle API server running on http://localhost:${PORT}`)
})
