import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, CheckCircle, Camera, FileText, Shield, Clock, DollarSign, MapPin, Briefcase } from 'lucide-react'

const steps = [
  { id: 1, title: 'Business Profile', icon: Briefcase },
  { id: 2, title: 'Services & Pricing', icon: DollarSign },
  { id: 3, title: 'Verification', icon: Shield },
  { id: 4, title: 'Complete', icon: CheckCircle },
]

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const [services, setServices] = useState([''])
  const [uploadedDocs, setUploadedDocs] = useState({ license: false, insurance: false, photo: false })

  const addService = () => setServices(prev => [...prev, ''])
  const updateService = (i, val) => setServices(prev => prev.map((s, idx) => idx === i ? val : s))

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Toggle!</h2>
          <p className="text-gray-500 mb-6">Your provider account is set up. Your profile is under review and will be live within 24 hours.</p>
          <div className="bg-gray-50 rounded-2xl p-5 text-left mb-6">
            <h3 className="font-semibold mb-3">Next Steps:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> Set your availability on the Dashboard</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> Upload photos and videos of your work</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> Write your first blog post</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> Connect your Samiteon card for payments</li>
            </ul>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Set Up Your Provider Account</h1>
        <p className="text-gray-500">Complete your profile to start receiving customers</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-10 max-w-md mx-auto">
        {steps.slice(0, 3).map((s, i) => {
          const Icon = s.icon
          return (
            <div key={s.id} className="flex items-center">
              <div className={`flex flex-col items-center`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  step >= s.id ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.id ? <CheckCircle size={20} /> : <Icon size={20} />}
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= s.id ? 'text-brand-600' : 'text-gray-400'}`}>{s.title}</span>
              </div>
              {i < 2 && <div className={`w-20 h-1 rounded mx-2 mb-6 ${step > s.id ? 'bg-brand-600' : 'bg-gray-200'}`} />}
            </div>
          )
        })}
      </div>

      <div className="card p-6">
        {/* Step 1: Business Profile */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Business Profile</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <Camera size={24} className="text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Upload Business Logo</p>
                <p className="text-xs text-gray-400">JPG, PNG. Max 5MB</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Description</label>
              <textarea placeholder="Tell customers about your experience, specialties, and why they should choose you..."
                className="input-field h-28 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Operating Hours</label>
                <div className="flex gap-2">
                  <input type="time" defaultValue="08:00" className="input-field" />
                  <span className="self-center text-gray-400">to</span>
                  <input type="time" defaultValue="18:00" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Operating Days</label>
                <select className="input-field" defaultValue="Mon-Fri">
                  <option>Mon-Fri</option>
                  <option>Mon-Sat</option>
                  <option>Mon-Sun</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Area Radius (miles)</label>
              <input type="number" defaultValue="15" placeholder="15" className="input-field" />
            </div>
          </div>
        )}

        {/* Step 2: Services & Pricing */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Services & Pricing</h2>
            <div className="space-y-3">
              {services.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <input type="text" value={s} onChange={(e) => updateService(i, e.target.value)}
                    placeholder={`Service ${i + 1} (e.g., Leak Repair)`} className="input-field flex-1" />
                  <input type="number" placeholder="$/hr" className="input-field w-24" />
                </div>
              ))}
              <button onClick={addService} className="text-sm text-brand-600 font-medium hover:text-brand-700">
                + Add Another Service
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Hourly Rate ($)</label>
              <input type="number" placeholder="75" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Response Time Commitment</label>
              <select className="input-field">
                <option>Under 15 minutes</option>
                <option>Under 30 minutes</option>
                <option>Under 1 hour</option>
                <option>Under 2 hours</option>
                <option>Same day</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Verification */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Verification Documents</h2>
            <p className="text-sm text-gray-500">Upload documents to verify your business and build trust with customers</p>

            {[
              { key: 'license', title: 'Business License / Certification', desc: 'Required - State or local business license' },
              { key: 'insurance', title: 'Liability Insurance', desc: 'Required - Proof of insurance coverage' },
              { key: 'photo', title: 'Photo ID', desc: 'Required - Government-issued ID' },
            ].map(doc => (
              <div key={doc.key}
                onClick={() => setUploadedDocs(prev => ({ ...prev, [doc.key]: true }))}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  uploadedDocs[doc.key] ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-brand-300'
                }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  uploadedDocs[doc.key] ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {uploadedDocs[doc.key] ? <CheckCircle size={20} className="text-green-600" /> : <Upload size={20} className="text-gray-400" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{doc.title}</p>
                  <p className="text-xs text-gray-400">{uploadedDocs[doc.key] ? 'Uploaded successfully' : doc.desc}</p>
                </div>
              </div>
            ))}

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
              <Shield size={16} className="inline mr-2" />
              All documents are encrypted and securely stored. Your information is never shared publicly.
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">
              Back
            </button>
          )}
          <button onClick={() => setStep(step + 1)}
            className="btn-primary flex-1">
            {step === 3 ? 'Submit for Review' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
