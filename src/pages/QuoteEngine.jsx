import { useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Calculator, Send, CheckCircle, DollarSign, CreditCard } from 'lucide-react'
import { serviceCategories } from '../data/mockData'

export default function QuoteEngine({ providers }) {
  const { providerId } = useParams()
  const [searchParams] = useSearchParams()
  const prefilledService = searchParams.get('service') || ''

  const [formData, setFormData] = useState({
    category: providerId ? providers.find(p => p.id === parseInt(providerId))?.category || '' : '',
    description: prefilledService,
    urgency: 'standard',
    budget: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [estimates, setEstimates] = useState(null)

  const selectedProvider = providerId ? providers.find(p => p.id === parseInt(providerId)) : null

  const calculateEstimate = () => {
    const baseRates = { Plumbing: 85, Electrical: 95, HVAC: 110, Cleaning: 55, Landscaping: 65, Painting: 70 }
    const base = baseRates[formData.category] || 75
    const urgencyMultiplier = formData.urgency === 'emergency' ? 1.5 : formData.urgency === 'priority' ? 1.25 : 1
    const low = Math.round(base * urgencyMultiplier * 0.8)
    const high = Math.round(base * urgencyMultiplier * 2.5)
    return { low, high, avg: Math.round((low + high) / 2) }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setEstimates(calculateEstimate())
    setSubmitted(true)
  }

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  if (submitted && estimates) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="card p-8 text-center">
          <CheckCircle size={56} className="mx-auto text-accent-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Estimate Ready!</h2>
          <p className="text-gray-500 mb-8">Based on your requirements, here's the estimated cost range:</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-5 bg-green-50 rounded-2xl">
              <p className="text-sm text-green-600 font-medium">Low Estimate</p>
              <p className="text-3xl font-bold text-green-700">${estimates.low}</p>
            </div>
            <div className="p-5 bg-brand-50 rounded-2xl border-2 border-brand-200">
              <p className="text-sm text-brand-600 font-medium">Average</p>
              <p className="text-3xl font-bold text-brand-700">${estimates.avg}</p>
            </div>
            <div className="p-5 bg-orange-50 rounded-2xl">
              <p className="text-sm text-orange-600 font-medium">High Estimate</p>
              <p className="text-3xl font-bold text-orange-700">${estimates.high}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 text-left mb-6">
            <h3 className="font-semibold mb-3">Quote Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Category</dt><dd className="font-medium">{formData.category}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Urgency</dt><dd className="font-medium capitalize">{formData.urgency}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Description</dt><dd className="font-medium text-right max-w-xs">{formData.description}</dd></div>
            </dl>
          </div>

          {/* Samiteon Payment */}
          <div className="bg-gradient-to-r from-samiteon-500 to-samiteon-700 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CreditCard size={20} />
              <h3 className="font-bold text-lg">Pay with Samiteon</h3>
            </div>
            <p className="text-white/80 text-sm mb-4">Secure payment through Samiteon charge card services</p>
            <button className="bg-white text-samiteon-700 font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors">
              Connect Samiteon Card to Pay
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => { setSubmitted(false); setEstimates(null) }}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">
              Modify Quote
            </button>
            <Link to="/messages" className="btn-primary flex items-center gap-2">
              <Send size={16} /> Contact Providers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calculator size={24} className="text-brand-600" /> Quote Engine
        </h1>
        <p className="text-gray-500">Get an instant cost estimate for the service you need</p>
        {selectedProvider && (
          <p className="text-brand-600 font-medium mt-1">Requesting quote from: {selectedProvider.name}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Category *</label>
            <select value={formData.category} onChange={(e) => update('category', e.target.value)}
              required className="input-field">
              <option value="">Select a category</option>
              {serviceCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Urgency Level</label>
            <div className="flex gap-2">
              {['standard', 'priority', 'emergency'].map(u => (
                <button key={u} type="button" onClick={() => update('urgency', u)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    formData.urgency === u
                      ? u === 'emergency' ? 'bg-red-500 text-white' : u === 'priority' ? 'bg-orange-500 text-white' : 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Describe the Service Needed *</label>
          <textarea value={formData.description} onChange={(e) => update('description', e.target.value)}
            required placeholder="Please describe what you need in detail..."
            className="input-field h-28 resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
            <input type="text" value={formData.name} onChange={(e) => update('name', e.target.value)}
              required placeholder="Full name" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)}
              required placeholder="you@email.com" className="input-field" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)}
              placeholder="(555) 000-0000" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Range</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={formData.budget} onChange={(e) => update('budget', e.target.value)}
                placeholder="e.g., 100-300" className="input-field pl-10" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Address</label>
          <input type="text" value={formData.address} onChange={(e) => update('address', e.target.value)}
            placeholder="Where should the service be performed?" className="input-field" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date</label>
            <input type="date" value={formData.preferredDate} onChange={(e) => update('preferredDate', e.target.value)}
              className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Time</label>
            <input type="time" value={formData.preferredTime} onChange={(e) => update('preferredTime', e.target.value)}
              className="input-field" />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4">
          <Calculator size={20} /> Get Instant Estimate
        </button>
      </form>
    </div>
  )
}
