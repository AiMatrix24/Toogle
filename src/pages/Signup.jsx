import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, MapPin, Briefcase, Eye, EyeOff, UserPlus } from 'lucide-react'
import { serviceCategories } from '../data/constants'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [role, setRole] = useState('customer')
  const [showPass, setShowPass] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    address: '', city: '', state: '', zip: '',
    businessName: '', category: '', description: '', hourlyRate: '',
    agreeTerms: false
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await signup({ ...form, role })
      navigate(role === 'provider' ? '/onboarding' : '/')
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join Toggle</h1>
          <p className="text-gray-500 mt-1">Create your account to get started</p>
        </div>

        <div className="card p-6">
          <div className="flex gap-2 mb-6">
            {['customer', 'provider'].map(r => (
              <button key={r} type="button" onClick={() => { setRole(r); setStep(1) }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  role === r ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {r === 'customer' ? 'Customer' : 'Service Provider'}
              </button>
            ))}
          </div>

          {/* Progress */}
          {role === 'provider' && (
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>{s}</div>
                  {s < 3 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-brand-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                      required placeholder="John Doe" className="input-field pl-11" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                      required placeholder="you@email.com" className="input-field pl-11" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                      required placeholder="(555) 000-0000" className="input-field pl-11" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPass ? 'text' : 'password'} value={form.password}
                        onChange={(e) => update('password', e.target.value)}
                        required placeholder="Min 8 chars" className="input-field pl-11" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPass ? 'text' : 'password'} value={form.confirmPassword}
                        onChange={(e) => update('confirmPassword', e.target.value)}
                        required placeholder="Confirm" className="input-field pl-11" />
                    </div>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={showPass} onChange={() => setShowPass(!showPass)}
                    className="w-4 h-4 rounded" />
                  <span className="text-gray-500">Show passwords</span>
                </label>
              </>
            )}

            {/* Step 2: Address (Provider) */}
            {step === 2 && role === 'provider' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name</label>
                  <div className="relative">
                    <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.businessName} onChange={(e) => update('businessName', e.target.value)}
                      required placeholder="Your business name" className="input-field pl-11" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Category</label>
                  <select value={form.category} onChange={(e) => update('category', e.target.value)}
                    required className="input-field">
                    <option value="">Select category</option>
                    {serviceCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)}
                      required placeholder="123 Main St" className="input-field pl-11" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)}
                    required placeholder="City" className="input-field" />
                  <input type="text" value={form.state} onChange={(e) => update('state', e.target.value)}
                    required placeholder="State" className="input-field" />
                  <input type="text" value={form.zip} onChange={(e) => update('zip', e.target.value)}
                    required placeholder="ZIP" className="input-field" />
                </div>
              </>
            )}

            {/* Step 3: Business Details (Provider) */}
            {step === 3 && role === 'provider' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Describe Your Services</label>
                  <textarea value={form.description} onChange={(e) => update('description', e.target.value)}
                    required placeholder="Tell customers about your business, experience, and specialties..."
                    className="input-field h-28 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly Rate ($)</label>
                  <input type="number" value={form.hourlyRate} onChange={(e) => update('hourlyRate', e.target.value)}
                    required placeholder="e.g., 75" className="input-field" />
                </div>
                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={form.agreeTerms}
                    onChange={(e) => update('agreeTerms', e.target.checked)}
                    required className="w-4 h-4 mt-0.5 rounded" />
                  <span className="text-sm text-gray-600">
                    I agree to the Toggle Terms of Service, Privacy Policy, and Service Provider Agreement.
                    I confirm that all information provided is accurate.
                  </span>
                </label>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && role === 'provider' && (
                <button type="button" onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">
                  Back
                </button>
              )}
              {(role === 'customer' || step === 3) ? (
                <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                  <UserPlus size={18} /> {loading ? 'Creating...' : 'Create Account'}
                </button>
              ) : (
                <button type="button" onClick={() => setStep(step + 1)}
                  className="btn-primary flex-1">
                  Continue
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
