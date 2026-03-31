import { useState } from 'react'
import { FileText, Shield, Lock, Scale } from 'lucide-react'

const legalPages = {
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    lastUpdated: 'March 2026',
    sections: [
      { heading: '1. Acceptance of Terms', content: 'By accessing or using the Toggle platform, you agree to be bound by these Terms of Service. Toggle provides a real-time service availability marketplace connecting customers with service providers. If you do not agree to these terms, do not use our platform.' },
      { heading: '2. User Accounts', content: 'You must provide accurate, complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to use Toggle. Each person may maintain only one account.' },
      { heading: '3. Service Provider Obligations', content: 'Service providers must maintain valid licenses, insurance, and certifications for their trade. Providers must accurately represent their availability status. Toggling to "Available" indicates readiness to accept and perform service requests.' },
      { heading: '4. Customer Obligations', content: 'Customers must provide accurate service descriptions, locations, and contact information. Customers agree to the quoted pricing before booking confirmation. Cancellations must follow our cancellation policy.' },
      { heading: '5. Payments', content: 'All payments are processed through our platform via Samiteon charge card services or approved payment methods. Toggle charges a service fee on completed bookings. Providers receive payouts according to the payout schedule. All transactions are recorded on the blockchain for verification.' },
      { heading: '6. Cancellation Policy', content: 'Bookings may be cancelled up to 2 hours before the scheduled time without penalty. Late cancellations may incur a fee determined by the service provider. Emergency cancellations due to documented circumstances are handled on a case-by-case basis.' },
      { heading: '7. Dispute Resolution', content: 'Disputes are handled through our three-tier resolution system: automated resolution for standard cases, human mediation for complex cases, and binding arbitration for high-value disputes. All parties agree to participate in good faith.' },
      { heading: '8. Limitation of Liability', content: 'Toggle is a marketplace platform facilitating connections between customers and service providers. Toggle is not the provider of services and is not liable for the quality, safety, or legality of services performed. Toggle provides verification tools but does not guarantee provider qualifications.' },
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    icon: Lock,
    lastUpdated: 'March 2026',
    sections: [
      { heading: '1. Information We Collect', content: 'We collect information you provide directly: name, email, phone, address, payment information, and service preferences. We also collect usage data: search queries, booking history, location data (with consent), device information, and interaction patterns.' },
      { heading: '2. How We Use Your Information', content: 'We use your data to: match you with service providers, process payments, send notifications, improve our matching algorithms, prevent fraud, and comply with legal obligations. Location data is used for geofencing-based provider matching.' },
      { heading: '3. Location Data', content: 'Provider locations are masked to approximate coordinates until a booking is confirmed. Customer addresses are revealed to providers only after job acceptance. All location data is encrypted at rest and purged after 90 days.' },
      { heading: '4. Data Sharing', content: 'We share data with: service providers (for matched bookings), payment processors (Samiteon/Stripe), identity verification services (for provider verification), and law enforcement (when legally required). We never sell personal data to third parties.' },
      { heading: '5. Data Retention', content: 'Account data is retained while your account is active. Booking records are retained for 7 years for tax and legal compliance. Location data is purged after 90 days. You may request data deletion at any time.' },
      { heading: '6. Your Rights', content: 'You have the right to: access your personal data, correct inaccurate data, delete your data, export your data in a portable format, and opt out of marketing communications. Contact privacy@toggle.app to exercise these rights.' },
      { heading: '7. GDPR/CCPA Compliance', content: 'Toggle complies with GDPR for EU users and CCPA for California residents. We maintain appropriate technical and organizational measures to protect personal data. Our Data Protection Officer can be reached at dpo@toggle.app.' },
    ]
  },
  provider: {
    title: 'Provider Agreement',
    icon: Scale,
    lastUpdated: 'March 2026',
    sections: [
      { heading: '1. Provider Status', content: 'Service providers using Toggle are independent contractors, not employees of Toggle. Providers set their own rates, hours, and service areas. Toggle provides the technology platform to connect providers with customers.' },
      { heading: '2. Verification Requirements', content: 'All providers must complete identity verification, submit valid business licenses for regulated trades, provide proof of insurance, and consent to background checks. Verification must be maintained throughout active use of the platform.' },
      { heading: '3. Availability Commitment', content: 'When toggled to "Available," providers commit to responding to booking requests within the timeframe indicated. Repeated failures to respond or excessive cancellations result in ranking penalties and potential suspension.' },
      { heading: '4. Service Standards', content: 'Providers must deliver services as described, arrive within the confirmed time window, maintain professional conduct, and comply with all applicable laws and regulations. Customer safety is paramount.' },
      { heading: '5. Fees and Payouts', content: 'Toggle charges a 10-15% service fee on completed bookings. Payouts are processed weekly via Samiteon charge card or approved methods. Transaction details are available in your provider dashboard.' },
      { heading: '6. Reviews and Ratings', content: 'Providers agree to the review system. Only verified booking customers can leave reviews. Providers may respond to reviews through their dashboard. Fraudulent reviews from either party are investigated and removed.' },
    ]
  },
}

export default function Legal() {
  const [activePage, setActivePage] = useState('terms')
  const page = legalPages[activePage]
  const PageIcon = page.icon

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield size={24} className="text-brand-600" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900">Legal</h1>
      </div>

      {/* Page Selector */}
      <div className="flex gap-2 mb-8 overflow-x-auto" role="tablist" aria-label="Legal documents">
        {Object.entries(legalPages).map(([key, p]) => {
          const Icon = p.icon
          return (
            <button key={key} onClick={() => setActivePage(key)}
              role="tab" aria-selected={activePage === key}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 ${
                activePage === key ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}>
              <Icon size={16} aria-hidden="true" /> {p.title}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="card p-8" role="tabpanel">
        <div className="flex items-center gap-3 mb-6">
          <PageIcon size={20} className="text-brand-600" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{page.title}</h2>
            <p className="text-xs text-gray-400">Last updated: {page.lastUpdated}</p>
          </div>
        </div>

        <div className="space-y-6">
          {page.sections.map((s, i) => (
            <section key={i}>
              <h3 className="font-semibold text-gray-900 mb-2">{s.heading}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
          <p>For questions about these policies, contact legal@toggle.app</p>
        </div>
      </div>
    </div>
  )
}
