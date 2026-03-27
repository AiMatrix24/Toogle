import { useState } from 'react'
import { HelpCircle, MessageSquare, FileText, AlertTriangle, ChevronDown, ChevronRight, Phone, Mail, Shield } from 'lucide-react'

const faqs = [
  { q: 'How does the availability toggle work?', a: 'Service providers can toggle their availability status on or off from their dashboard. When toggled on, customers can see them as "Available Now" and book services immediately.' },
  { q: 'How are payments processed through Samiteon?', a: 'Samiteon charge card services provide secure, encrypted payment processing. Connect your Samiteon card in your profile settings, and all transactions are recorded on the blockchain for transparency.' },
  { q: 'What does the QR code on my contract do?', a: 'Each service contract generates a unique QR code that links to the blockchain record of your transaction. Scanning it verifies the contract details, payment, and service provider information.' },
  { q: 'How do I file a dispute?', a: 'Navigate to your service history, select the service in question, and click "Open Dispute." Our team will review the case within 48 hours and mediate between both parties.' },
  { q: 'How are providers verified?', a: 'All providers must submit business licenses, insurance documents, and photo ID during onboarding. Our team verifies each document before approving the provider\'s profile.' },
  { q: 'Can I cancel a booking?', a: 'Yes, bookings can be cancelled up to 2 hours before the scheduled time without penalty. Late cancellations may incur a fee determined by the service provider.' },
]

export default function Support() {
  const [activeTab, setActiveTab] = useState('faq')
  const [openFaq, setOpenFaq] = useState(null)
  const [disputeSubmitted, setDisputeSubmitted] = useState(false)
  const [disputeForm, setDisputeForm] = useState({ contractId: '', type: '', description: '' })

  const tabs = [
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
    { id: 'dispute', label: 'File Dispute', icon: AlertTriangle },
    { id: 'contact', label: 'Contact Us', icon: MessageSquare },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Help & Support Center</h1>
        <p className="text-gray-500">Get help, file disputes, or contact our team</p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === t.id ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}>
              <Icon size={16} /> {t.label}
            </button>
          )
        })}
      </div>

      {/* FAQs */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dispute */}
      {activeTab === 'dispute' && (
        <div className="card p-6">
          {disputeSubmitted ? (
            <div className="text-center py-8">
              <Shield size={48} className="mx-auto text-brand-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Dispute Submitted</h2>
              <p className="text-gray-500 mb-4">Our team will review your case within 48 hours. You'll receive updates via email and notifications.</p>
              <p className="text-sm text-gray-400">Reference: DSP-{Date.now().toString().slice(-6)}</p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-500" /> File a Dispute
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contract / Booking ID</label>
                  <input type="text" value={disputeForm.contractId}
                    onChange={(e) => setDisputeForm(prev => ({ ...prev, contractId: e.target.value }))}
                    placeholder="e.g., SC-2026-001" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Dispute Type</label>
                  <select value={disputeForm.type}
                    onChange={(e) => setDisputeForm(prev => ({ ...prev, type: e.target.value }))}
                    className="input-field">
                    <option value="">Select type</option>
                    <option>Service not completed</option>
                    <option>Quality issues</option>
                    <option>Overcharged</option>
                    <option>Provider no-show</option>
                    <option>Property damage</option>
                    <option>Billing dispute</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Describe the Issue</label>
                  <textarea value={disputeForm.description}
                    onChange={(e) => setDisputeForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please provide as much detail as possible about the issue..."
                    className="input-field h-32 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Supporting Evidence</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-brand-300 transition-colors">
                    <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Upload photos, screenshots, or documents</p>
                    <p className="text-xs text-gray-400">Max 10MB per file</p>
                  </div>
                </div>
                <button onClick={() => setDisputeSubmitted(true)}
                  className="btn-primary w-full">
                  Submit Dispute
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Contact */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Send a Message</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Your Name" className="input-field" />
              <input type="email" placeholder="Email Address" className="input-field" />
              <select className="input-field">
                <option value="">Select Topic</option>
                <option>Account Issue</option>
                <option>Payment Problem</option>
                <option>Technical Support</option>
                <option>Feedback</option>
                <option>Partnership Inquiry</option>
              </select>
              <textarea placeholder="How can we help?" className="input-field h-28 resize-none" />
              <button className="btn-primary w-full">Send Message</button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: 'Phone Support', value: '1-800-TOOGLE', desc: 'Mon-Fri 8AM-8PM EST' },
                  { icon: Mail, label: 'Email', value: 'support@toogle.com', desc: 'Response within 24 hours' },
                  { icon: MessageSquare, label: 'Live Chat', value: 'Available Now', desc: 'Average wait: 2 min' },
                ].map(c => {
                  const Icon = c.icon
                  return (
                    <div key={c.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                        <Icon size={18} className="text-brand-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{c.label}</p>
                        <p className="text-xs text-gray-500">{c.value} &middot; {c.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card p-6 bg-brand-50 border-brand-100">
              <h3 className="font-bold text-brand-900 mb-2">Emergency Service Issue?</h3>
              <p className="text-sm text-brand-700 mb-3">
                If you have an urgent safety concern or active service emergency, call our priority line immediately.
              </p>
              <a href="tel:1-800-911-TOOGLE" className="btn-primary w-full text-center block">
                <Phone size={16} className="inline mr-2" /> Call Priority Line
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
