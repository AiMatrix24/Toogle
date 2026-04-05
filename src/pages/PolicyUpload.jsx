import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, Shield, CheckCircle, Clock, DollarSign, AlertCircle, X, Star, ArrowRight } from 'lucide-react'
import { policies } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const insuranceTypes = [
  { value: 'health', label: 'Health' }, { value: 'medicare', label: 'Medicare' },
  { value: 'life', label: 'Life' }, { value: 'auto', label: 'Auto' },
  { value: 'home', label: 'Home' }, { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
]

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending Review' },
  in_review: { icon: FileText, color: 'bg-blue-100 text-blue-700', label: 'In Review' },
  reviewed: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Reviewed' },
  quoted: { icon: DollarSign, color: 'bg-purple-100 text-purple-700', label: 'Quote Ready' },
  expired: { icon: AlertCircle, color: 'bg-gray-100 text-gray-600', label: 'Expired' },
}

export default function PolicyUpload() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('upload')
  const [myPolicies, setMyPolicies] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [form, setForm] = useState({
    insuranceType: '', policyNumber: '', carrierName: '',
    expirationDate: '', currentPremium: '', coverageSummary: '',
  })
  const fileRef = useRef(null)

  useEffect(() => {
    if (user) policies.mine().then(setMyPolicies).catch(() => {})
  }, [user, uploadSuccess])

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File must be under 10MB')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('policy', selectedFile)
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v) })

      await policies.upload(formData)
      setUploadSuccess(true)
      setSelectedFile(null)
      setForm({ insuranceType: '', policyNumber: '', carrierName: '', expirationDate: '', currentPremium: '', coverageSummary: '' })
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      alert('Upload failed: ' + (err.message || 'Please try again'))
    } finally {
      setUploading(false)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center" aria-hidden="true">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Review</h1>
          <p className="text-gray-500">Upload your current policy for a free competitive quote</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'upload', label: 'Upload Policy' },
          { id: 'my-policies', label: `My Policies (${myPolicies.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setUploadSuccess(false) }}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === t.id ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {uploadSuccess && (
            <div className="card p-6 border-2 border-green-200 bg-green-50 text-center">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
              <h3 className="text-lg font-bold text-green-800 mb-1">Policy Uploaded Successfully!</h3>
              <p className="text-sm text-green-600 mb-4">A licensed professional will review your policy and provide a competitive quote within 24 hours.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setUploadSuccess(false)} className="btn-primary text-sm py-2 px-4">Upload Another</button>
                <button onClick={() => setActiveTab('my-policies')} className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">View My Policies</button>
              </div>
            </div>
          )}

          {!uploadSuccess && (
            <>
              {/* How it works */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-4">How Policy Review Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { step: '1', title: 'Upload', desc: 'Upload your current insurance policy document (PDF, image, or text)' },
                    { step: '2', title: 'Expert Review', desc: 'A licensed insurance professional reviews your coverage and rates' },
                    { step: '3', title: 'Get Your Quote', desc: 'Receive a competitive quote with potential savings breakdown' },
                  ].map(s => (
                    <div key={s.step} className="text-center p-4">
                      <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-2 text-brand-700 font-bold" aria-hidden="true">{s.step}</div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">{s.title}</h3>
                      <p className="text-xs text-gray-500">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-4">Upload Your Policy</h2>

                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setSelectedFile(f) } }}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    selectedFile ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
                  }`}
                  role="button" aria-label="Click or drag to upload policy document" tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}>
                  <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt" aria-label="Select policy file" />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size={32} className="text-brand-600" />
                      <div className="text-left">
                        <p className="font-semibold text-brand-700">{selectedFile.name}</p>
                        <p className="text-sm text-brand-500">{formatSize(selectedFile.size)}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileRef.current) fileRef.current.value = '' }}
                        className="p-1 rounded hover:bg-brand-100" aria-label="Remove file">
                        <X size={18} className="text-brand-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={40} className="mx-auto text-gray-300 mb-3" />
                      <p className="font-semibold text-gray-700 mb-1">Drop your policy document here</p>
                      <p className="text-sm text-gray-400">or click to browse (PDF, JPG, PNG, DOC — max 10MB)</p>
                    </>
                  )}
                </div>
              </div>

              {/* Policy Details */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-4">Policy Details (optional but helps with quoting)</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pol-type">Insurance Type</label>
                      <select id="pol-type" value={form.insuranceType} onChange={(e) => update('insuranceType', e.target.value)} className="input-field">
                        <option value="">Select type</option>
                        {insuranceTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pol-carrier">Current Carrier</label>
                      <input id="pol-carrier" type="text" value={form.carrierName} onChange={(e) => update('carrierName', e.target.value)}
                        className="input-field" placeholder="e.g., Blue Cross, State Farm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pol-num">Policy Number</label>
                      <input id="pol-num" type="text" value={form.policyNumber} onChange={(e) => update('policyNumber', e.target.value)}
                        className="input-field" placeholder="Policy #" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pol-exp">Expiration Date</label>
                      <input id="pol-exp" type="date" value={form.expirationDate} onChange={(e) => update('expirationDate', e.target.value)}
                        className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pol-prem">Current Premium ($/mo)</label>
                      <input id="pol-prem" type="number" value={form.currentPremium} onChange={(e) => update('currentPremium', e.target.value)}
                        className="input-field" placeholder="0.00" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pol-summary">Coverage Summary / Notes</label>
                    <textarea id="pol-summary" value={form.coverageSummary} onChange={(e) => update('coverageSummary', e.target.value)}
                      className="input-field h-20 resize-none" placeholder="Briefly describe what your policy covers, any concerns, or what you're looking for..." />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button onClick={handleUpload} disabled={!selectedFile || uploading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 flex items-center justify-center gap-2">
                <Upload size={20} /> {uploading ? 'Uploading...' : 'Submit Policy for Review'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Your policy document is encrypted and only shared with the licensed professional reviewing your quote. Toggle does not sell your data.
              </p>
            </>
          )}
        </div>
      )}

      {/* My Policies Tab */}
      {activeTab === 'my-policies' && (
        <div className="space-y-4">
          {myPolicies.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <FileText size={48} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium mb-2">No policies uploaded yet</p>
              <button onClick={() => setActiveTab('upload')} className="btn-primary text-sm py-2 px-4">Upload Your First Policy</button>
            </div>
          ) : myPolicies.map(p => {
            const status = statusConfig[p.reviewStatus] || statusConfig.pending
            const StatusIcon = status.icon
            return (
              <div key={p.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center" aria-hidden="true">
                      <FileText size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{p.fileName}</h3>
                      <p className="text-xs text-gray-400">
                        {p.carrierName && `${p.carrierName} · `}
                        {p.insuranceType && `${p.insuranceType.charAt(0).toUpperCase() + p.insuranceType.slice(1)} · `}
                        {p.createdAt?.split('T')[0]}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
                    <StatusIcon size={12} /> {status.label}
                  </span>
                </div>

                {p.currentPremium && (
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>Current: <strong>${p.currentPremium}/mo</strong></span>
                    {p.policyNumber && <span>Policy: <strong>{p.policyNumber}</strong></span>}
                    {p.expirationDate && <span>Expires: <strong>{p.expirationDate}</strong></span>}
                  </div>
                )}

                {/* Quote result */}
                {p.reviewStatus === 'quoted' && p.quotedPremium && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-green-800">Competitive Quote</span>
                      <span className="text-2xl font-bold text-green-600">${p.quotedPremium}/mo</span>
                    </div>
                    {p.potentialSavings > 0 && (
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          You could save ${p.potentialSavings}/mo (${Math.round(p.potentialSavings * 12)}/year)
                        </span>
                      </div>
                    )}
                    <Link to="/lead-intake" className="flex items-center gap-1 text-sm text-green-700 font-medium mt-2 hover:text-green-800">
                      Book appointment to switch <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {/* Reviewer notes */}
                {p.reviewerNotes && (
                  <div className="bg-brand-50 border-l-4 border-brand-500 rounded-r-xl p-3">
                    <p className="text-xs font-medium text-brand-700 mb-0.5">Agent Review{p.reviewerName ? ` by ${p.reviewerName}` : ''}</p>
                    <p className="text-sm text-brand-800">{p.reviewerNotes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
