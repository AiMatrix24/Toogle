import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Heart, Car, Home, Briefcase, Users, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { qadeAppointments } from '../lib/api'

const insuranceTypes = [
  { id: 'health', label: 'Health Insurance', icon: Heart, desc: 'ACA / Marketplace / Employer' },
  { id: 'medicare', label: 'Medicare', icon: Users, desc: 'Medicare Advantage / Supplement / Part D' },
  { id: 'life', label: 'Life Insurance', icon: Shield, desc: 'Term / Whole / Universal Life' },
  { id: 'auto', label: 'Auto Insurance', icon: Car, desc: 'Personal / Commercial Auto' },
  { id: 'home', label: 'Home Insurance', icon: Home, desc: 'Homeowner / Renter / Condo' },
  { id: 'commercial', label: 'Commercial', icon: Briefcase, desc: 'Business / Liability / Workers Comp' },
]

export default function LeadIntakeForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    insuranceType: '', firstName: '', lastName: '', email: '', phone: '',
    zipCode: '', state: '', intentDescription: '', tcpaConsent: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const data = await qadeAppointments.submitLead(form)
      setResult(data)
      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Find a Licensed Professional</h1>
          <p className="text-gray-500 mt-1">Get matched with a verified, available expert in minutes</p>
        </div>

        {/* Progress */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-8 max-w-xs mx-auto">
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

        <div className="card p-6">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

          {/* Step 1: Insurance Type */}
          {step === 1 && (
            <div>
              <h2 className="font-bold text-gray-900 mb-4">What type of coverage do you need?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {insuranceTypes.map(t => (
                  <button key={t.id} onClick={() => { update('insuranceType', t.id); setStep(2) }}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:border-brand-400 hover:shadow-md ${
                      form.insuranceType === t.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200'
                    }`} aria-label={t.label}>
                    <t.icon size={24} className="text-brand-600 mb-2" aria-hidden="true" />
                    <p className="font-semibold text-sm text-gray-900">{t.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div>
              <h2 className="font-bold text-gray-900 mb-4">Your Contact Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="first-name">First Name</label>
                    <input id="first-name" type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)}
                      required className="input-field" placeholder="First name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="last-name">Last Name</label>
                    <input id="last-name" type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)}
                      required className="input-field" placeholder="Last name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lead-phone">Phone Number</label>
                  <input id="lead-phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                    required className="input-field" placeholder="(555) 000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lead-email">Email</label>
                  <input id="lead-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                    required className="input-field" placeholder="you@email.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lead-zip">ZIP Code</label>
                    <input id="lead-zip" type="text" value={form.zipCode} onChange={(e) => update('zipCode', e.target.value)}
                      required maxLength={5} className="input-field" placeholder="90012" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lead-state">State</label>
                    <select id="lead-state" value={form.state} onChange={(e) => update('state', e.target.value)}
                      required className="input-field">
                      <option value="">Select state</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lead-intent">What are you looking for? (optional)</label>
                  <textarea id="lead-intent" value={form.intentDescription} onChange={(e) => update('intentDescription', e.target.value)}
                    className="input-field h-20 resize-none" placeholder="Describe your insurance needs..." />
                  <p className="text-xs text-gray-400 mt-1">Do not include medical information, diagnoses, or treatment details.</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={() => setStep(3)}
                  disabled={!form.firstName || !form.lastName || !form.phone || !form.email || !form.zipCode || !form.state}
                  className="btn-primary flex-1 disabled:opacity-50">
                  Continue <ArrowRight size={16} className="inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: TCPA Consent */}
          {step === 3 && (
            <div>
              <h2 className="font-bold text-gray-900 mb-4">Consent & Submission</h2>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-medium text-sm text-gray-800 mb-2">Your Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Type:</strong> {insuranceTypes.find(t => t.id === form.insuranceType)?.label}</p>
                  <p><strong>Name:</strong> {form.firstName} {form.lastName}</p>
                  <p><strong>Phone:</strong> {form.phone}</p>
                  <p><strong>Email:</strong> {form.email}</p>
                  <p><strong>Location:</strong> {form.zipCode}, {form.state}</p>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl cursor-pointer mb-4">
                <input type="checkbox" checked={form.tcpaConsent}
                  onChange={(e) => update('tcpaConsent', e.target.checked)}
                  className="w-4 h-4 mt-1 rounded" aria-label="TCPA consent" />
                <span className="text-xs text-gray-600 leading-relaxed">
                  By submitting this form, I provide my prior express written consent to be contacted by Toggle and its network of licensed insurance professionals at the phone number provided, including via automated calls, texts, and prerecorded messages, for the purpose of discussing insurance options. This consent is not a condition of any purchase.
                </span>
              </label>

              <p className="text-xs text-gray-400 mb-4">
                Toggle uses automated systems to match you with a licensed insurance professional based on your location, insurance needs, and provider availability.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleSubmit} disabled={!form.tcpaConsent || submitting}
                  className="btn-primary flex-1 disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && result && (
            <div className="text-center py-6">
              <CheckCircle size={56} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
              <p className="text-gray-500 mb-4">We're matching you with a licensed {insuranceTypes.find(t => t.id === form.insuranceType)?.label.toLowerCase()} professional.</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Request ID</span>
                  <span className="font-mono text-xs">{result.appointmentId?.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Qualification Score</span>
                  <span className={`font-bold ${result.qualificationScore >= 80 ? 'text-green-600' : result.qualificationScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {result.qualificationScore}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{result.status}</span>
                </div>
              </div>

              <button onClick={() => navigate('/')} className="btn-primary">
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
