import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { createTables } from './schema.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'toggle.db')

// Delete existing DB for clean seed
import fs from 'fs'
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath)

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

createTables(db)

const hash = bcrypt.hashSync('password123', 10)

// Create customer user
const customerId = uuid()
db.prepare(`INSERT INTO users (id, email, password_hash, name, phone, role, address, city, state, zip)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
  customerId, 'john@email.com', hash, 'John Doe', '(555) 999-0000', 'customer',
  '456 Oak Ave', 'Los Angeles', 'CA', '90012'
)

// Create admin user
const adminId = uuid()
db.prepare(`INSERT INTO users (id, email, password_hash, name, phone, role)
  VALUES (?, ?, ?, ?, ?, ?)`).run(
  adminId, 'admin@toggle.com', hash, 'Admin', '(555) 000-0000', 'admin'
)

// Provider data matching mockData.js
const providers = [
  {
    name: "Mike's Plumbing Pro", category: 'Plumbing', hourlyRate: 85,
    description: 'Licensed master plumber with 15+ years of experience. Emergency services available 24/7.',
    services: ['Leak Repair', 'Drain Cleaning', 'Water Heater Install', 'Pipe Replacement', 'Fixture Installation'],
    hours: { open: '7:00 AM', close: '9:00 PM', days: 'Mon-Sat' },
    lat: 34.0522, lng: -118.2437, address: '1234 Main St, Los Angeles, CA 90012',
    distance: 1.2, phone: '(555) 123-4567', available: true, responseTime: '< 15 min',
    rating: 4.8, reviewCount: 234, favoriteCount: 89, email: 'mike@plumbingpro.com',
    portfolio: [
      { title: 'Kitchen Faucet Replacement', description: 'Replaced corroded faucet with new Moen fixture', service: 'Fixture Installation', date: '2026-03-15', beforeColor: '#8B4513', afterColor: '#4682B4', beforeLabel: 'Corroded faucet, water damage visible', afterLabel: 'New Moen fixture, clean finish' },
      { title: 'Slab Leak Repair', description: 'Detected and repaired slab leak without demolition', service: 'Leak Repair', date: '2026-02-28', beforeColor: '#654321', afterColor: '#228B22', beforeLabel: 'Water pooling, cracked foundation', afterLabel: 'Sealed and dry, no more leaks' },
    ],
    reviews: [
      { user: 'Sarah M.', rating: 5, text: 'Fixed our leak in under an hour. Professional and clean work!', date: '2026-03-20' },
      { user: 'James K.', rating: 5, text: 'Great price and even better service. Highly recommend!', date: '2026-03-15' },
      { user: 'Linda P.', rating: 4, text: 'Good work, arrived on time. Slightly pricey but worth it.', date: '2026-03-10' },
    ],
    blog: [
      { title: '5 Signs You Need to Replace Your Water Heater', date: '2026-03-18', excerpt: "Your water heater won't last forever. Here are the warning signs..." },
      { title: 'Preventing Frozen Pipes This Winter', date: '2026-02-10', excerpt: 'Frozen pipes can cause thousands in damage. Learn how to protect your home...' },
    ],
    media: [
      { type: 'video', title: 'How We Fix Slab Leaks', url: '#' },
      { type: 'podcast', title: 'Home Plumbing Tips Ep. 12', url: '#' },
    ],
  },
  {
    name: 'Spark Electric Solutions', category: 'Electrical', hourlyRate: 95,
    description: 'Full-service electrical contractor. Residential and commercial. Licensed, bonded, insured.',
    services: ['Panel Upgrades', 'Outlet Installation', 'Lighting', 'Rewiring', 'EV Charger Install'],
    hours: { open: '8:00 AM', close: '6:00 PM', days: 'Mon-Fri' },
    lat: 34.0625, lng: -118.2350, address: '567 Electric Ave, Los Angeles, CA 90014',
    distance: 2.4, phone: '(555) 234-5678', available: true, responseTime: '< 30 min',
    rating: 4.9, reviewCount: 189, favoriteCount: 67, email: 'spark@electric.com',
    portfolio: [
      { title: 'EV Charger Installation', description: 'Level 2 charger installed in residential garage', service: 'EV Charger Install', date: '2026-03-10', beforeColor: '#696969', afterColor: '#00CED1', beforeLabel: 'Empty garage wall, no outlet', afterLabel: 'Tesla Wall Connector installed, wired to panel' },
    ],
    reviews: [
      { user: 'Tom R.', rating: 5, text: 'Installed our EV charger perfectly. Clean, fast, professional.', date: '2026-03-22' },
      { user: 'Amy W.', rating: 5, text: "Best electrician we've ever used. Fair pricing.", date: '2026-03-12' },
    ],
    blog: [
      { title: 'Is Your Home Ready for an EV Charger?', date: '2026-03-15', excerpt: 'Electric vehicles are the future. Make sure your electrical panel can handle it...' },
    ],
    media: [{ type: 'video', title: 'Panel Upgrade Walkthrough', url: '#' }],
  },
  {
    name: 'CoolBreeze HVAC', category: 'HVAC', hourlyRate: 110,
    description: 'Heating, ventilation, and air conditioning specialists. Installations, repairs, and maintenance.',
    services: ['AC Repair', 'Furnace Repair', 'Duct Cleaning', 'System Install', 'Maintenance Plans'],
    hours: { open: '8:00 AM', close: '5:00 PM', days: 'Mon-Fri' },
    lat: 34.0450, lng: -118.2600, address: '890 Cool St, Los Angeles, CA 90015',
    distance: 3.1, phone: '(555) 345-6789', available: false, responseTime: '< 1 hr',
    rating: 4.6, reviewCount: 156, favoriteCount: 43, email: 'cool@breeze.com',
    portfolio: [
      { title: 'Full HVAC System Replacement', description: 'Removed 20-year old system, installed energy-efficient unit', service: 'System Install', date: '2026-02-20', beforeColor: '#A0522D', afterColor: '#87CEEB', beforeLabel: 'Outdated, noisy HVAC unit', afterLabel: 'New Carrier Infinity system installed' },
    ],
    reviews: [
      { user: 'Dave L.', rating: 5, text: 'Replaced our entire HVAC system. Excellent work and fair price.', date: '2026-03-19' },
      { user: 'Maria G.', rating: 4, text: 'Good service but had to wait a day for appointment.', date: '2026-03-05' },
    ],
    blog: [], media: [],
  },
  {
    name: 'Pristine Clean Co.', category: 'Cleaning', hourlyRate: 55,
    description: 'Professional home and office cleaning. Eco-friendly products. Satisfaction guaranteed.',
    services: ['Deep Cleaning', 'Regular Maintenance', 'Move-In/Move-Out', 'Office Cleaning', 'Carpet Cleaning'],
    hours: { open: '6:00 AM', close: '8:00 PM', days: 'Mon-Sun' },
    lat: 34.0580, lng: -118.2500, address: '321 Clean Blvd, Los Angeles, CA 90013',
    distance: 0.8, phone: '(555) 456-7890', available: true, responseTime: '< 20 min',
    rating: 4.7, reviewCount: 312, favoriteCount: 124, email: 'pristine@clean.com',
    portfolio: [
      { title: 'Move-Out Deep Clean', description: 'Complete apartment cleaning for move-out inspection', service: 'Move-In/Move-Out', date: '2026-03-05', beforeColor: '#8B8682', afterColor: '#F5F5DC', beforeLabel: 'Dusty surfaces, stained carpet', afterLabel: 'Spotless, passed inspection' },
      { title: 'Office Space Transformation', description: '5000 sq ft office deep clean', service: 'Office Cleaning', date: '2026-02-15', beforeColor: '#778899', afterColor: '#FFFACD', beforeLabel: 'Cluttered, dusty office space', afterLabel: 'Pristine, organized workspace' },
    ],
    reviews: [
      { user: 'Nancy S.', rating: 5, text: 'Our house has never looked better! Amazing attention to detail.', date: '2026-03-21' },
      { user: 'Rick B.', rating: 5, text: 'Reliable, thorough, and reasonably priced. Our go-to cleaners!', date: '2026-03-14' },
    ],
    blog: [
      { title: 'Spring Cleaning Checklist 2026', date: '2026-03-01', excerpt: 'Get your home ready for spring with our comprehensive checklist...' },
    ],
    media: [
      { type: 'video', title: 'Our Eco-Friendly Cleaning Process', url: '#' },
      { type: 'audio', title: 'Clean Living Podcast Ep. 5', url: '#' },
    ],
  },
  {
    name: 'GreenScape Landscaping', category: 'Landscaping', hourlyRate: 65,
    description: 'Transform your outdoor space. Design, installation, and maintenance services.',
    services: ['Lawn Care', 'Garden Design', 'Tree Trimming', 'Irrigation', 'Hardscaping'],
    hours: { open: '7:00 AM', close: '5:00 PM', days: 'Mon-Sat' },
    lat: 34.0700, lng: -118.2300, address: '654 Garden Way, Los Angeles, CA 90016',
    distance: 4.2, phone: '(555) 567-8901', available: true, responseTime: '< 45 min',
    rating: 4.5, reviewCount: 98, favoriteCount: 31, email: 'green@scape.com',
    portfolio: [
      { title: 'Backyard Redesign', description: 'Complete backyard transformation with patio and garden', service: 'Garden Design', date: '2026-03-01', beforeColor: '#8B7355', afterColor: '#32CD32', beforeLabel: 'Bare dirt, overgrown weeds', afterLabel: 'Lush garden with stone patio' },
    ],
    reviews: [
      { user: 'Carol T.', rating: 5, text: 'Beautiful garden design. Transformed our backyard completely!', date: '2026-03-18' },
    ],
    blog: [], media: [],
  },
  {
    name: 'Perfect Coat Painters', category: 'Painting', hourlyRate: 70,
    description: 'Interior and exterior painting. Color consultation included. Premium paints only.',
    services: ['Interior Painting', 'Exterior Painting', 'Cabinet Refinishing', 'Deck Staining', 'Wallpaper'],
    hours: { open: '8:00 AM', close: '6:00 PM', days: 'Mon-Fri' },
    lat: 34.0400, lng: -118.2700, address: '789 Color Ln, Los Angeles, CA 90017',
    distance: 5.5, phone: '(555) 678-9012', available: false, responseTime: '< 2 hrs',
    rating: 4.4, reviewCount: 76, favoriteCount: 22, email: 'perfect@coat.com',
    portfolio: [
      { title: 'Living Room Makeover', description: 'Accent wall with Benjamin Moore premium paint', service: 'Interior Painting', date: '2026-02-25', beforeColor: '#D2B48C', afterColor: '#4169E1', beforeLabel: 'Faded beige walls, scuff marks', afterLabel: 'Rich navy accent wall, crisp trim' },
      { title: 'Exterior Home Repaint', description: 'Full exterior repaint with 10-year warranty', service: 'Exterior Painting', date: '2026-01-15', beforeColor: '#808080', afterColor: '#F0E68C', beforeLabel: 'Peeling gray paint, sun damage', afterLabel: 'Fresh warm yellow, new trim color' },
    ],
    reviews: [
      { user: 'Phil H.', rating: 4, text: 'Great color matching and clean lines. A bit slow but quality work.', date: '2026-03-16' },
    ],
    blog: [], media: [],
  },
]

const insertUser = db.prepare(`INSERT INTO users (id, email, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?, ?)`)
const insertProvider = db.prepare(`INSERT INTO providers (id, user_id, business_name, category, description, hourly_rate, phone, available, response_time, lat, lng, address, distance, favorite_count, rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
const insertService = db.prepare(`INSERT INTO provider_services (id, provider_id, name) VALUES (?, ?, ?)`)
const insertPortfolio = db.prepare(`INSERT INTO provider_portfolio (id, provider_id, title, description, service, date, before_color, after_color, before_label, after_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
const insertReview = db.prepare(`INSERT INTO provider_reviews (id, provider_id, user_name, rating, text, date) VALUES (?, ?, ?, ?, ?, ?)`)
const insertBlog = db.prepare(`INSERT INTO provider_blog (id, provider_id, title, excerpt, published, created_at) VALUES (?, ?, ?, ?, 1, ?)`)
const insertMedia = db.prepare(`INSERT INTO provider_media (id, provider_id, type, title, url) VALUES (?, ?, ?, ?, ?)`)
const insertHours = db.prepare(`INSERT INTO provider_hours (id, provider_id, day_of_week, open_time, close_time, is_closed) VALUES (?, ?, ?, ?, ?, ?)`)

// Seed deals
const insertDeal = db.prepare(`INSERT INTO deals (id, provider_id, title, description, original_price, deal_price, percent_off, category, max_claims, claimed_count, expires_at, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`)

// Seed bookings (from mockSchedule)
const insertBooking = db.prepare(`INSERT INTO bookings (id, customer_id, provider_id, service_name, date, start_time, end_time, status, notes, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

// Seed payments (from mockContracts)
const insertPayment = db.prepare(`INSERT INTO payments (id, booking_id, customer_id, provider_id, amount, subtotal, service_fee, tax, payment_method, status, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

// Seed rewards
const insertReward = db.prepare(`INSERT INTO rewards (id, user_id, action, points, type, created_at) VALUES (?, ?, ?, ?, ?, ?)`)

// Seed payouts
const insertPayout = db.prepare(`INSERT INTO payouts (id, provider_id, amount, status, method, created_at, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)

const seedAll = db.transaction(() => {
  const providerIds = {}

  // Days mapping for hours
  const daysMap = {
    'Mon-Sat': [1,2,3,4,5,6],
    'Mon-Fri': [1,2,3,4,5],
    'Mon-Sun': [0,1,2,3,4,5,6],
  }

  providers.forEach((p, idx) => {
    const userId = uuid()
    const providerId = uuid()
    providerIds[idx + 1] = providerId

    insertUser.run(userId, p.email, hash, p.name, p.phone, 'provider')
    insertProvider.run(providerId, userId, p.name, p.category, p.description, p.hourlyRate, p.phone, p.available ? 1 : 0, p.responseTime, p.lat, p.lng, p.address, p.distance, p.favoriteCount, p.rating, p.reviewCount)

    p.services.forEach(s => insertService.run(uuid(), providerId, s))
    p.portfolio.forEach(item => insertPortfolio.run(uuid(), providerId, item.title, item.description, item.service, item.date, item.beforeColor, item.afterColor, item.beforeLabel, item.afterLabel))
    p.reviews.forEach(r => insertReview.run(uuid(), providerId, r.user, r.rating, r.text, r.date))
    p.blog.forEach(b => insertBlog.run(uuid(), providerId, b.title, b.excerpt, b.date))
    p.media.forEach(m => insertMedia.run(uuid(), providerId, m.type, m.title, m.url))

    const days = daysMap[p.hours.days] || [1,2,3,4,5]
    for (let d = 0; d <= 6; d++) {
      const isClosed = days.includes(d) ? 0 : 1
      insertHours.run(uuid(), providerId, d, isClosed ? null : p.hours.open, isClosed ? null : p.hours.close, isClosed)
    }
  })

  // Seed bookings from mockSchedule (all for provider 1 = Mike's Plumbing)
  const scheduleData = [
    { customer: 'Sarah M.', service: 'Leak Repair', date: '2026-03-28', startTime: '09:00', endTime: '10:30', status: 'confirmed', notes: 'Kitchen faucet leak', amount: 120 },
    { customer: 'James K.', service: 'Drain Cleaning', date: '2026-03-28', startTime: '11:00', endTime: '12:00', status: 'confirmed', notes: 'Bathroom drain slow', amount: 85 },
    { customer: 'Tom W.', service: 'Water Heater Install', date: '2026-03-28', startTime: '14:00', endTime: '17:00', status: 'pending', notes: '50 gal tank replacement', amount: 450 },
    { customer: 'Linda P.', service: 'Pipe Replacement', date: '2026-03-29', startTime: '08:00', endTime: '11:00', status: 'confirmed', notes: 'Copper pipe in basement', amount: 350 },
    { customer: 'Rick B.', service: 'Fixture Installation', date: '2026-03-29', startTime: '13:00', endTime: '14:30', status: 'confirmed', notes: 'New bathroom faucet', amount: 150 },
    { customer: 'Nancy S.', service: 'Leak Repair', date: '2026-03-30', startTime: '10:00', endTime: '11:00', status: 'pending', notes: 'Outdoor spigot', amount: 95 },
    { customer: 'Amy W.', service: 'Drain Cleaning', date: '2026-03-31', startTime: '09:00', endTime: '10:00', status: 'confirmed', notes: 'Kitchen garbage disposal', amount: 85 },
    { customer: 'Dave L.', service: 'Water Heater Install', date: '2026-04-01', startTime: '08:00', endTime: '12:00', status: 'confirmed', notes: 'Tankless install', amount: 650 },
    { customer: 'Carol T.', service: 'Fixture Installation', date: '2026-04-02', startTime: '14:00', endTime: '15:30', status: 'pending', notes: 'Kitchen sink sprayer', amount: 120 },
    { customer: 'Phil H.', service: 'Pipe Replacement', date: '2026-04-03', startTime: '09:00', endTime: '13:00', status: 'confirmed', notes: 'Main water line section', amount: 500 },
  ]
  const bookingIds = []
  scheduleData.forEach(s => {
    const bId = uuid()
    bookingIds.push(bId)
    insertBooking.run(bId, customerId, providerIds[1], s.service, s.date, s.startTime, s.endTime, s.status, s.notes, s.amount)
  })

  // Seed deals
  const dealsData = [
    { pid: 3, title: 'Spring AC Tune-Up', description: 'Complete AC system check, filter replacement, and performance optimization', originalPrice: 110, dealPrice: 82, percentOff: 25, category: 'HVAC', maxClaims: 30, claimed: 18 },
    { pid: 4, title: 'First-Time Deep Clean Special', description: 'Full home deep cleaning with eco-friendly products. New customers only!', originalPrice: 55, dealPrice: 40, percentOff: 27, category: 'Cleaning', maxClaims: 50, claimed: 24 },
    { pid: 2, title: 'Free Electrical Inspection', description: 'Complimentary whole-home electrical safety inspection with any repair booking', originalPrice: 95, dealPrice: 0, percentOff: 100, category: 'Electrical', maxClaims: 20, claimed: 12 },
    { pid: 1, title: 'Drain Cleaning Bundle', description: 'Clean up to 3 drains for the price of 1. Includes camera inspection', originalPrice: 255, dealPrice: 120, percentOff: 53, category: 'Plumbing', maxClaims: 25, claimed: 8 },
    { pid: 5, title: 'Spring Lawn Revival Package', description: 'Full lawn aeration, overseeding, and fertilization treatment', originalPrice: 195, dealPrice: 130, percentOff: 33, category: 'Landscaping', maxClaims: 15, claimed: 6 },
    { pid: 6, title: 'Interior Room Repaint Special', description: 'One room painted with premium Benjamin Moore paint. Includes prep and cleanup', originalPrice: 350, dealPrice: 245, percentOff: 30, category: 'Painting', maxClaims: 10, claimed: 4 },
    { pid: 4, title: 'Weekly Cleaning Subscription', description: 'Sign up for 4 weekly cleanings and get the 5th FREE', originalPrice: 275, dealPrice: 220, percentOff: 20, category: 'Cleaning', maxClaims: 40, claimed: 31 },
    { pid: 1, title: 'Water Heater Flush & Check', description: 'Annual water heater maintenance to extend life and improve efficiency', originalPrice: 150, dealPrice: 89, percentOff: 41, category: 'Plumbing', maxClaims: 20, claimed: 14 },
  ]
  dealsData.forEach(d => {
    const expiresAt = new Date(Date.now() + 86400000 * 7).toISOString()
    insertDeal.run(uuid(), providerIds[d.pid], d.title, d.description, d.originalPrice, d.dealPrice, d.percentOff, d.category, d.maxClaims, d.claimed, expiresAt)
  })

  // Seed payments (from mockContracts)
  const paymentData = [
    { bookingIdx: 0, amount: 120, status: 'completed', pid: 1 },
    { bookingIdx: 4, amount: 190, status: 'completed', pid: 2 },
    { bookingIdx: 6, amount: 165, status: 'pending', pid: 4 },
  ]
  paymentData.forEach(p => {
    const bId = bookingIds[p.bookingIdx] || uuid()
    insertPayment.run(uuid(), bId, customerId, providerIds[p.pid], p.amount, p.amount - 5, 5, Math.round(p.amount * 0.09), 'samiteon', p.status, 'TXN-' + uuid().slice(0, 8))
  })

  // Seed rewards
  const rewardsData = [
    { action: "Completed booking with Mike's Plumbing Pro", points: 100, type: 'earn', date: '2026-03-20' },
    { action: "Left review for Mike's Plumbing Pro", points: 50, type: 'earn', date: '2026-03-20' },
    { action: 'Completed booking with Spark Electric Solutions', points: 100, type: 'earn', date: '2026-03-15' },
    { action: 'First booking with new provider bonus', points: 75, type: 'earn', date: '2026-03-15' },
    { action: 'Referred friend: Alex M.', points: 200, type: 'earn', date: '2026-03-10' },
    { action: 'Redeemed: $10 off booking', points: -500, type: 'redeem', date: '2026-03-08' },
    { action: 'Completed booking with Pristine Clean Co.', points: 100, type: 'earn', date: '2026-03-05' },
    { action: 'Left review for Pristine Clean Co.', points: 50, type: 'earn', date: '2026-03-05' },
    { action: 'Referred friend: Sam T.', points: 200, type: 'earn', date: '2026-02-28' },
    { action: 'Completed booking with CoolBreeze HVAC', points: 100, type: 'earn', date: '2026-02-20' },
  ]
  rewardsData.forEach(r => {
    insertReward.run(uuid(), customerId, r.action, r.points, r.type, r.date + 'T12:00:00.000Z')
  })

  // Seed payouts for Mike's Plumbing
  const payoutsData = [
    { date: '2026-03-24', amount: 1250, status: 'paid' },
    { date: '2026-03-17', amount: 980, status: 'paid' },
    { date: '2026-03-10', amount: 1100, status: 'paid' },
    { date: '2026-03-03', amount: 870, status: 'paid' },
    { date: '2026-03-28', amount: 1400, status: 'processing' },
  ]
  payoutsData.forEach(p => {
    insertPayout.run(uuid(), providerIds[1], p.amount, p.status, 'samiteon', p.date, p.status === 'paid' ? p.date : null)
  })

  // === MODULE 29: QADE Seed Data ===

  // Seed carrier partnerships
  const carrierIds = {}
  const carriers = [
    { name: 'Blue Cross Blue Shield', code: 'BCBS', states: ['AL','CA','FL','NY','TX'], types: ['health','medicare'] },
    { name: 'UnitedHealthcare', code: 'UHC', states: ['CA','FL','NY','TX','IL'], types: ['health','medicare','life'] },
    { name: 'Aetna', code: 'AETNA', states: ['CA','NY','FL','TX'], types: ['health'] },
  ]
  carriers.forEach(c => {
    const cId = uuid()
    carrierIds[c.code] = cId
    db.prepare('INSERT INTO carrier_partnerships (id, carrier_name, carrier_code, states_active, insurance_types) VALUES (?, ?, ?, ?, ?)').run(
      cId, c.name, c.code, JSON.stringify(c.states), JSON.stringify(c.types)
    )
  })

  // Seed provider licensing (first 2 providers get insurance licenses)
  const licensingData = [
    { pid: 1, state: 'CA', license: 'CA-INS-2024-001', npn: '12345678', loa: ['health','medicare','life'] },
    { pid: 1, state: 'FL', license: 'FL-INS-2024-002', npn: '12345678', loa: ['health','medicare'] },
    { pid: 2, state: 'CA', license: 'CA-INS-2024-003', npn: '87654321', loa: ['health','life','auto'] },
    { pid: 2, state: 'NY', license: 'NY-INS-2024-004', npn: '87654321', loa: ['health','life'] },
  ]
  const now = new Date().toISOString()
  licensingData.forEach(l => {
    db.prepare('INSERT INTO provider_licensing (id, provider_id, state_code, license_number, npn, lines_of_authority, license_status, verified, verified_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)').run(
      uuid(), providerIds[l.pid], l.state, l.license, l.npn, JSON.stringify(l.loa), 'active', now
    )
  })

  // Seed appointment capacity
  Object.entries(providerIds).forEach(([, pid]) => {
    db.prepare('INSERT INTO appointment_capacity (id, provider_id) VALUES (?, ?)').run(uuid(), pid)
  })

  // Seed sample leads
  const sampleLeads = [
    { fn: 'Sarah', ln: 'Johnson', email: 'sarah.j@email.com', phone: '5551234567', zip: '90012', state: 'CA', type: 'health', score: 85 },
    { fn: 'Michael', ln: 'Chen', email: 'mchen@email.com', phone: '5559876543', zip: '10001', state: 'NY', type: 'medicare', score: 92 },
    { fn: 'Lisa', ln: 'Rodriguez', email: 'lisa.r@email.com', phone: '5554567890', zip: '33101', state: 'FL', type: 'life', score: 45 },
  ]
  sampleLeads.forEach(l => {
    const leadId = uuid()
    const apptId = uuid()
    db.prepare(`INSERT INTO qade_leads (id, first_name, last_name, email, phone, zip_code, state, insurance_type, tcpa_consent, tcpa_consent_timestamp, qualification_score, qualification_stage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`).run(
      leadId, l.fn, l.ln, l.email, l.phone, l.zip, l.state, l.type, now, l.score, l.score >= 60 ? 'final' : 'pending'
    )
    db.prepare('INSERT INTO qade_appointments (id, lead_id, status) VALUES (?, ?, ?)').run(
      apptId, leadId, l.score >= 60 ? 'QUALIFIED' : 'SUBMITTED'
    )
    db.prepare('INSERT INTO compliance_events (id, event_type, entity_type, entity_id, detail, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
      uuid(), 'consent_captured', 'lead', leadId, JSON.stringify({ type: 'tcpa', score: l.score }), now
    )
  })

  // Store provider ID mapping for reference
  console.log('Provider ID mapping:')
  Object.entries(providerIds).forEach(([oldId, newId]) => {
    const p = providers[parseInt(oldId) - 1]
    console.log(`  ${oldId} (${p.name}) -> ${newId}`)
  })
})

seedAll()
console.log('Database seeded successfully!')
db.close()
