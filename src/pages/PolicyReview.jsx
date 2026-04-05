import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle, Clock, DollarSign, Star, Send, Eye, ArrowLeft } from 'lucide-react'
import { policies } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function PolicyReview() {
  const { user } = useAuth()
  const [pending, setPending] = useState([])
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [reviewForm, setReviewForm] = useState({ notes: '', quotedPremium: '', potentialSavings: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    policies.pending().then(setPending).catch(() => {})
  }, [])

  const handleStartReview = async (policyId) => {
    await policies.review(policyId, { status: 'in_review' })
    const detail = await policies.get(policyId)
    setSelectedPolicy(detail)
    setPending(prev => prev.map(p => p.id === policyId ? { ...p, reviewStatus: 'in_review' } : p))
  }

  const handleSubmitReview = async () => {
    if (!selectedPolicy) return
    setSubmitting(true)
    try {
      const status = reviewForm.quotedPremium ? 'quoted' : 'reviewed'
      await policies.review(selectedPolicy.id, {
        status,
        notes: reviewForm.notes,
        quotedPremium: reviewForm.quotedPremium ? parseFloat(reviewForm.quotedPremium) : null,
        potentialSavings: reviewForm.potentialSavings ? parseFloat(reviewForm.potentialSavings) : null,
      })
      setPending(prev => prev.filter(p => p.id !== selectedPolicy.id))
      setSelectedPolicy(null)
      setReviewForm({ notes: '', quotedPremium: '', potentialSavings: '' })
    } catch (err) {
      alert('Failed: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (selectedPolicy) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => setSelectedPolicy(null)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={16} /> Back to Queue
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Policy Info */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-brand-600" /> Policy Details
            </h2>
            <div className="space-y-3 text-sm">
              {[
                { label: 'File', value: selectedPolicy.fileName },
                { label: 'Consumer', value: selectedPolicy.consumerName || 'Anonymous' },
                { label: 'Type', value: selectedPolicy.insuranceType?.charAt(0).toUpperCase() + selectedPolicy.insuranceType?.slice(1) },
                { label: 'Carrier', value: selectedPolicy.carrierName || 'Not specified' },
                { label: 'Policy #', value: selectedPolicy.policyNumber || 'Not provided' },
                { label: 'Expiration', value: selectedPolicy.expirationDate || 'Not provided' },
                { label: 'Current Premium', value: selectedPolicy.currentPremium ? `$${selectedPolicy.currentPremium}/mo` : 'Not provided' },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{r.label}</span>
                  <span className="font-medium text-gray-900">{r.value}</span>
                </div>
              ))}
            </div>
            {selectedPolicy.coverageSummary && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 mb-1">Consumer Notes</p>
                <p className="text-sm text-gray-700">{selectedPolicy.coverageSummary}</p>
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star size={18} className="text-yellow-500" /> Your Review & Quote
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="review-notes">Review Notes</label>
                <textarea id="review-notes" value={reviewForm.notes}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-field h-32 resize-none"
                  placeholder="Summarize your findings: coverage gaps, areas for improvement, competitive advantages of your quote..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quoted-prem">Your Quoted Premium ($/mo)</label>
                  <input id="quoted-prem" type="number" step="0.01" value={reviewForm.quotedPremium}
                    onChange={(e) => {
                      const quoted = e.target.value
                      setReviewForm(prev => ({
                        ...prev,
                        quotedPremium: quoted,
                        potentialSavings: selectedPolicy.currentPremium && quoted
                          ? Math.max(0, selectedPolicy.currentPremium - parseFloat(quoted)).toFixed(2)
                          : prev.potentialSavings,
                      }))
                    }}
                    className="input-field" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="savings">Potential Savings ($/mo)</label>
                  <input id="savings" type="number" step="0.01" value={reviewForm.potentialSavings}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, potentialSavings: e.target.value }))}
                    className="input-field" placeholder="Auto-calculated" />
                </div>
              </div>

              {reviewForm.potentialSavings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <p className="text-sm text-green-700">Customer saves <strong>${reviewForm.potentialSavings}/mo</strong> = <strong>${Math.round(reviewForm.potentialSavings * 12)}/year</strong></p>
                </div>
              )}

              <button onClick={handleSubmitReview} disabled={submitting || !reviewForm.notes}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                <Send size={16} /> {submitting ? 'Submitting...' : reviewForm.quotedPremium ? 'Submit Quote' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Review Queue</h1>
          <p className="text-gray-500 text-sm">Review customer policies and provide competitive quotes</p>
        </div>
        <Link to="/dashboard" className="text-sm text-brand-600 font-medium hover:text-brand-700">Back to Dashboard</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 bg-yellow-50">
          <Clock size={18} className="text-yellow-600 mb-1" aria-hidden="true" />
          <p className="text-2xl font-bold text-yellow-700">{pending.filter(p => p.reviewStatus === 'pending').length}</p>
          <p className="text-xs text-yellow-600">Awaiting Review</p>
        </div>
        <div className="card p-4 bg-blue-50">
          <Eye size={18} className="text-blue-600 mb-1" aria-hidden="true" />
          <p className="text-2xl font-bold text-blue-700">{pending.filter(p => p.reviewStatus === 'in_review').length}</p>
          <p className="text-xs text-blue-600">In Review</p>
        </div>
        <div className="card p-4 bg-green-50">
          <DollarSign size={18} className="text-green-600 mb-1" aria-hidden="true" />
          <p className="text-2xl font-bold text-green-700">$0</p>
          <p className="text-xs text-green-600">Avg Savings Found</p>
        </div>
      </div>

      {/* Queue */}
      <div className="space-y-3">
        {pending.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <FileText size={48} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No policies awaiting review</p>
            <p className="text-sm mt-1">New uploads will appear here automatically</p>
          </div>
        ) : pending.map(p => (
          <div key={p.id} className="card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center" aria-hidden="true">
                <FileText size={20} className="text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{p.consumerName || 'Anonymous'}</h3>
                <p className="text-xs text-gray-400">
                  {p.insuranceType?.charAt(0).toUpperCase() + p.insuranceType?.slice(1) || 'Unknown'} &middot;
                  {p.carrierName || 'Carrier N/A'} &middot;
                  {p.currentPremium ? `$${p.currentPremium}/mo` : 'Premium N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                p.reviewStatus === 'in_review' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{p.reviewStatus === 'in_review' ? 'In Review' : 'Pending'}</span>
              <button onClick={() => handleStartReview(p.id)}
                className="text-sm px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 font-medium">
                {p.reviewStatus === 'in_review' ? 'Continue Review' : 'Start Review'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
