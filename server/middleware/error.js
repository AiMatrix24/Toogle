export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message)

  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ error: 'Record already exists' })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
}
