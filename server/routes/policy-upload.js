import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { requireAuth, optionalAuth, requireRole } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '..', 'uploads', 'policies')

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuid()}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.txt']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('File type not allowed. Accepted: PDF, JPG, PNG, DOC, DOCX, TXT'))
  }
})

export default function policyUploadRoutes(db) {
  const router = Router()

  // POST /api/policies/upload - Upload a policy document
  router.post('/upload', optionalAuth, upload.single('policy'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const { insuranceType, policyNumber, carrierName, expirationDate, currentPremium, coverageSummary, leadId } = req.body
    const id = uuid()

    db.prepare(`INSERT INTO policy_uploads (id, user_id, lead_id, file_name, file_type, file_size, file_path, insurance_type, policy_number, carrier_name, expiration_date, current_premium, coverage_summary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, req.user?.id || null, leadId || null,
      req.file.originalname, req.file.mimetype, req.file.size, req.file.filename,
      insuranceType || 'other', policyNumber || null, carrierName || null,
      expirationDate || null, currentPremium ? parseFloat(currentPremium) : null,
      coverageSummary || null
    )

    res.json({
      id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      status: 'pending',
      message: 'Policy uploaded successfully. A licensed professional will review it shortly.'
    })
  })

  // GET /api/policies/mine - Consumer's uploaded policies
  router.get('/mine', requireAuth, (req, res) => {
    const policies = db.prepare(`
      SELECT p.*, pr.business_name as reviewer_name
      FROM policy_uploads p
      LEFT JOIN providers pr ON p.reviewer_provider_id = pr.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `).all(req.user.id)

    res.json(policies.map(p => ({
      id: p.id, fileName: p.file_name, fileType: p.file_type,
      fileSize: p.file_size, insuranceType: p.insurance_type,
      policyNumber: p.policy_number, carrierName: p.carrier_name,
      expirationDate: p.expiration_date, currentPremium: p.current_premium,
      coverageSummary: p.coverage_summary, reviewStatus: p.review_status,
      reviewerName: p.reviewer_name, reviewerNotes: p.reviewer_notes,
      quotedPremium: p.quoted_premium, potentialSavings: p.potential_savings,
      reviewedAt: p.reviewed_at, createdAt: p.created_at,
    })))
  })

  // GET /api/policies/pending - Provider: policies awaiting review
  router.get('/pending', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)

    const policies = db.prepare(`
      SELECT p.*, u.name as consumer_name, u.email as consumer_email
      FROM policy_uploads p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.review_status IN ('pending', 'in_review')
      ORDER BY p.created_at ASC
    `).all()

    res.json(policies.map(p => ({
      id: p.id, fileName: p.file_name, fileType: p.file_type,
      fileSize: p.file_size, insuranceType: p.insurance_type,
      policyNumber: p.policy_number, carrierName: p.carrier_name,
      expirationDate: p.expiration_date, currentPremium: p.current_premium,
      coverageSummary: p.coverage_summary, reviewStatus: p.review_status,
      consumerName: p.consumer_name, consumerEmail: p.consumer_email,
      createdAt: p.created_at,
    })))
  })

  // GET /api/policies/:id - Policy detail
  router.get('/:id', requireAuth, (req, res) => {
    const policy = db.prepare(`
      SELECT p.*, u.name as consumer_name, pr.business_name as reviewer_name
      FROM policy_uploads p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN providers pr ON p.reviewer_provider_id = pr.id
      WHERE p.id = ?
    `).get(req.params.id)
    if (!policy) return res.status(404).json({ error: 'Policy not found' })

    res.json({
      id: policy.id, fileName: policy.file_name, fileType: policy.file_type,
      fileSize: policy.file_size, insuranceType: policy.insurance_type,
      policyNumber: policy.policy_number, carrierName: policy.carrier_name,
      expirationDate: policy.expiration_date, currentPremium: policy.current_premium,
      coverageSummary: policy.coverage_summary, reviewStatus: policy.review_status,
      consumerName: policy.consumer_name, reviewerName: policy.reviewer_name,
      reviewerNotes: policy.reviewer_notes, quotedPremium: policy.quoted_premium,
      potentialSavings: policy.potential_savings, reviewedAt: policy.reviewed_at,
      createdAt: policy.created_at,
    })
  })

  // PATCH /api/policies/:id/review - Provider reviews a policy
  router.patch('/:id/review', requireAuth, (req, res) => {
    const provider = db.prepare('SELECT id FROM providers WHERE user_id = ?').get(req.user.id)
    if (!provider) return res.status(403).json({ error: 'Only providers can review policies' })

    const { status, notes, quotedPremium, potentialSavings } = req.body

    db.prepare(`UPDATE policy_uploads SET
      review_status = COALESCE(?, review_status),
      reviewer_provider_id = ?,
      reviewer_notes = COALESCE(?, reviewer_notes),
      quoted_premium = COALESCE(?, quoted_premium),
      potential_savings = COALESCE(?, potential_savings),
      reviewed_at = CASE WHEN ? IN ('reviewed', 'quoted') THEN datetime('now') ELSE reviewed_at END,
      updated_at = datetime('now')
      WHERE id = ?`).run(
      status, provider.id, notes, quotedPremium, potentialSavings, status, req.params.id
    )

    // Log to compliance
    db.prepare('INSERT INTO compliance_events (id, event_type, entity_type, entity_id, actor_id, actor_role, detail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))').run(
      uuid(), 'policy_reviewed', 'policy', req.params.id, req.user.id, 'provider',
      JSON.stringify({ status, quotedPremium, potentialSavings })
    )

    res.json({ ok: true })
  })

  // GET /api/policies/analytics/summary - Admin stats
  router.get('/analytics/summary', requireAuth, requireRole('admin'), (req, res) => {
    const total = db.prepare('SELECT COUNT(*) as count FROM policy_uploads').get().count
    const pending = db.prepare("SELECT COUNT(*) as count FROM policy_uploads WHERE review_status = 'pending'").get().count
    const reviewed = db.prepare("SELECT COUNT(*) as count FROM policy_uploads WHERE review_status IN ('reviewed','quoted')").get().count
    const avgSavings = db.prepare("SELECT AVG(potential_savings) as avg FROM policy_uploads WHERE potential_savings IS NOT NULL").get().avg || 0
    const totalSavings = db.prepare("SELECT SUM(potential_savings) as total FROM policy_uploads WHERE potential_savings IS NOT NULL").get().total || 0

    res.json({ total, pending, reviewed, avgSavings: Math.round(avgSavings), totalSavings: Math.round(totalSavings) })
  })

  return router
}
