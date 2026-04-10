import { useState } from 'react'
import { FileText, Shield, Lock, Scale, Briefcase } from 'lucide-react'

const legalPages = {
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    lastUpdated: 'April 2026',
    sections: [
      { heading: '1. Acceptance of Terms', content: 'By accessing or using the Toggle platform, operated in partnership with Powered by SA, you agree to be bound by these Terms of Service. Toggle provides a real-time availability marketplace connecting clients with qualified legal, finance, and technical service professionals. If you do not agree to these terms, do not use our platform.' },
      { heading: '2. Service Description', content: 'Toggle facilitates connections between clients and verified service providers across 12 verticals and 87+ service categories spanning the full spectrum from blue-collar trades to white-collar professionals. Verticals include: Home Repair & Maintenance, Construction & Remodeling, Technology & Electronics, Automotive Services, Beauty & Personal Care, Pet Services, Cleaning & Landscaping, Medical & Healthcare, Legal Services, Financial Services & Insurance, IT Services & Cybersecurity, and Specialty & Lifestyle. Professional services in Legal, Finance, and Technical verticals are powered in partnership with Powered by SA (poweredbysa.com), offering e-discovery, contract lifecycle management, due diligence, financial operations, global payroll, project management, and technical consulting. Toggle also operates a Qualified Appointment Distribution Engine (QADE) for insurance and professional service appointments with TCPA/CCPA-compliant lead intake. Toggle is a marketplace platform and does not itself provide professional advice.' },
      { heading: '3. Client Accounts', content: 'You must provide accurate, complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials. You must be authorized by your organization to engage professional services on its behalf. Each organization may maintain multiple user accounts under a single corporate entity.' },
      { heading: '4. Service Provider Obligations', content: 'Service providers must maintain valid professional licenses, certifications, and insurance applicable to their jurisdiction and service category. Legal service providers must be admitted to practice or operate under appropriate regulatory frameworks. Finance service providers must comply with applicable financial regulations including GAAP, IFRS, and local statutory requirements. Technical service providers must hold relevant professional accreditations and operate within recognized industry standards.' },
      { heading: '5. Engagement Terms', content: 'All service engagements facilitated through Toggle are subject to individual engagement letters or statements of work agreed between the client and service provider. Toggle records engagement terms on the blockchain for verification and audit purposes. Pricing is determined by the service provider and presented transparently before engagement confirmation. Estimated timelines and deliverables are specified in each engagement agreement.' },
      { heading: '6. Confidentiality & Privilege', content: 'Toggle recognizes that legal service engagements may involve attorney-client privileged communications and work product. All data transmitted through the platform for legal service engagements is treated as confidential. Service providers accessing client data through Toggle are bound by professional duties of confidentiality applicable to their discipline. Toggle implements encryption at rest and in transit for all client data and documents.' },
      { heading: '7. Payments', content: 'All payments are processed through our platform via Samiteon charge card services or approved payment methods. Toggle charges a service facilitation fee on completed engagements. Service providers receive payouts according to the agreed payout schedule. All transactions are recorded on the blockchain for verification. Invoices are generated for each engagement with detailed line items including service description, hours, and applicable taxes.' },
      { heading: '8. Cancellation & Refund Policy', content: 'Engagements may be cancelled by either party subject to the terms of the applicable engagement letter or statement of work. Cancellations within 24 hours of a scheduled consultation incur no fee. Late cancellations may incur a fee as specified in the engagement terms. Disputes regarding deliverables or service quality are handled through our three-tier resolution system.' },
      { heading: '9. Dispute Resolution', content: 'Disputes are handled through our three-tier resolution system: automated resolution for standard cases under specified thresholds, professional mediation for complex cases involving service quality or deliverable disputes, and binding arbitration for high-value disputes. All parties agree to participate in good faith. Blockchain-verified engagement records serve as evidence in dispute proceedings.' },
      { heading: '10. Limitation of Liability', content: 'Toggle is a marketplace platform facilitating connections between clients and professional service providers. Toggle is not the provider of legal, financial, or technical services and does not provide professional advice. Toggle is not liable for the quality, accuracy, or completeness of services performed by providers. Service providers carry their own professional indemnity and errors & omissions insurance. Clients should independently verify professional credentials and licensing.' },
      { heading: '11. Intellectual Property', content: 'Work product created during service engagements belongs to the client unless otherwise specified in the engagement letter. Toggle retains no ownership rights over client documents, work product, or deliverables uploaded or generated through the platform. The Toggle platform, its design, features, and technology are the intellectual property of Toggle and its partners.' },
      { heading: '12. Governing Law', content: 'These Terms are governed by applicable law based on the jurisdiction of the service engagement. Cross-border engagements are subject to the laws specified in the applicable engagement letter. Toggle operates in compliance with data protection regulations including GDPR, CCPA, and POPIA (South Africa).' },
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    icon: Lock,
    lastUpdated: 'April 2026',
    sections: [
      { heading: '1. Information We Collect', content: 'We collect information you provide directly: organization name, contact person details, email, phone, billing address, and service preferences. For legal service engagements, we collect matter details, document uploads, and engagement specifications. For finance service engagements, we collect financial data as specified in the engagement scope. For technical service engagements, we collect project specifications and documentation. We also collect usage data including platform interactions, search queries, and engagement history.' },
      { heading: '2. How We Use Your Information', content: 'We use your data to: match you with qualified service providers based on your requirements, jurisdiction, and service category; process payments and generate invoices; send engagement notifications and status updates; improve our matching algorithms and platform features; prevent fraud and ensure platform integrity; and comply with legal and regulatory obligations applicable to each service vertical.' },
      { heading: '3. Data Classification', content: 'Toggle classifies data into four tiers: Public (provider profiles, service listings), Confidential (engagement terms, pricing, invoices), Highly Confidential (client documents, financial records, legal matter details), and Privileged (attorney-client communications, legal work product). Each tier has specific access controls, encryption requirements, and retention policies.' },
      { heading: '4. Document Security', content: 'All documents uploaded to the platform are encrypted using AES-256 encryption at rest. Documents in transit are protected by TLS 1.3. Legal documents are stored in isolated environments with access restricted to the assigned service provider and authorized client users. Document access is logged with full audit trails including viewer identity, timestamp, and IP address.' },
      { heading: '5. Data Sharing', content: 'We share data with: assigned service providers (limited to engagement-specific data), payment processors (Samiteon/Stripe for transaction processing), cloud infrastructure providers (for hosting and storage), and law enforcement (when legally required). We never sell personal or organizational data to third parties. Cross-border data transfers comply with applicable data protection frameworks including Standard Contractual Clauses for EU data transfers.' },
      { heading: '6. Data Retention', content: 'Active engagement data is retained throughout the engagement and for 7 years post-completion for tax, legal, and audit compliance. Legal matter data follows applicable retention requirements which may extend to 10+ years depending on jurisdiction and matter type. Financial records are retained for 7 years per IRS and HMRC requirements. Technical project records are retained for 5 years. Documents are securely destroyed after the retention period expires.' },
      { heading: '7. Your Rights', content: 'You have the right to: access all personal and organizational data we hold, correct inaccurate data, request deletion of your data (subject to legal retention requirements), export your data in a portable format, restrict processing of your data, and object to automated decision-making. For POPIA (South Africa) subjects: you have the right to lodge a complaint with the Information Regulator. For GDPR subjects: contact our Data Protection Officer at dpo@toggle.app.' },
      { heading: '8. International Data Transfers', content: 'Toggle operates with service providers in South Africa and internationally. Data may be transferred across borders in accordance with applicable data protection laws. We implement appropriate safeguards including Standard Contractual Clauses, adequacy decisions, and binding corporate rules where applicable. South African data is processed in compliance with POPIA requirements.' },
    ]
  },
  provider: {
    title: 'Provider Agreement',
    icon: Scale,
    lastUpdated: 'April 2026',
    sections: [
      { heading: '1. Provider Status', content: 'Service providers using Toggle are independent professionals or firms, not employees of Toggle or Powered by SA. Providers set their own rates, availability, and service scope. Toggle provides the technology platform to connect providers with clients seeking legal, finance, and technical services.' },
      { heading: '2. Qualification Requirements', content: 'Legal service providers must hold valid practicing certificates, law degrees, or paralegal qualifications from recognized institutions. Finance service providers must hold relevant professional qualifications (CA, CPA, ACCA, CIMA, or equivalent) and comply with applicable regulatory frameworks. Technical service providers must hold relevant professional accreditations (PMP, RICS, SACPCMP, or equivalent). All providers must complete identity verification and submit proof of professional indemnity insurance.' },
      { heading: '3. Service Standards', content: 'Providers must deliver services as described in engagement agreements, meet agreed timelines and milestones, maintain professional conduct consistent with their professional body code of ethics, comply with all applicable laws and regulations, and protect client confidentiality. For legal services: providers must maintain attorney-client privilege where applicable and comply with bar association rules. For finance services: providers must comply with applicable accounting standards and financial regulations.' },
      { heading: '4. Availability Commitment', content: 'When toggled to Available, providers commit to responding to engagement requests within the timeframe indicated on their profile. Repeated failures to respond, excessive cancellations, or unmet deliverable deadlines result in ranking penalties and potential suspension. Providers may set specific availability windows by service type, jurisdiction, and engagement size.' },
      { heading: '5. Fees and Payouts', content: 'Toggle charges a platform facilitation fee of 10-15% on completed engagements. Providers set their own hourly, fixed-fee, or project-based rates. Payouts are processed weekly via Samiteon charge card or approved methods. Detailed invoices are generated for each engagement. Providers are responsible for their own tax obligations and filing requirements in their jurisdiction.' },
      { heading: '6. Professional Indemnity', content: 'All providers must maintain professional indemnity (PI) insurance or errors & omissions (E&O) insurance with minimum coverage of $1,000,000 per claim. Insurance certificates must be uploaded during onboarding and kept current. Toggle monitors expiration dates and suspends provider access 30 days before policy expiration if not renewed. Providers are solely responsible for claims arising from their professional services.' },
      { heading: '7. Conflict of Interest', content: 'Providers must disclose any conflicts of interest before accepting an engagement. Legal service providers must conduct conflict checks consistent with their bar association requirements. Finance service providers must disclose any financial interests in client entities. Failure to disclose material conflicts of interest may result in immediate suspension and engagement termination.' },
      { heading: '8. Data Handling', content: 'Providers agree to handle all client data in accordance with Toggle privacy policy, applicable data protection laws (GDPR, CCPA, POPIA), and professional obligations of confidentiality. Client data must not be retained beyond the engagement period unless required by law. Providers must notify Toggle immediately of any data breach or suspected unauthorized access to client information.' },
    ]
  },
  services: {
    title: 'Service Categories',
    icon: Briefcase,
    lastUpdated: 'April 2026',
    sections: [
      { heading: 'Legal Services', content: 'Toggle facilitates access to qualified legal professionals offering: E-Discovery (identification, preservation, processing, and review of electronic evidence for litigation and regulatory matters), Contract Lifecycle Management (drafting, negotiation, execution, and management of commercial contracts with compliance tracking), Due Diligence (comprehensive legal verification for mergers, acquisitions, investments, and regulatory compliance using structured project management methodologies), Form Completion & Compliance (automated and assisted form population for regulatory filings, court documents, and compliance submissions), and Dedicated Legal Resource Centers (offshore legal teams providing ongoing recruitment, training, supervision, and operational support).' },
      { heading: 'Finance Services', content: 'Toggle facilitates access to qualified finance professionals offering: Core Financial Operations (accounts payable/receivable, general ledger management, financial reconciliation, and management reporting to optimize business performance), Strategic Financial Operations (financial planning and analysis, budgeting, forecasting, and business intelligence to empower finance leaders with data-driven insights), Global Payroll Management (centralized payroll processing across multiple jurisdictions with local regulatory compliance, tax calculations, and statutory reporting), and Business Operational Call Centers (outsourced financial customer service, collections, billing inquiries, and account management).' },
      { heading: 'Technical Services', content: 'Toggle facilitates access to qualified technical professionals offering: Project Management Support (end-to-end coordination of construction and infrastructure projects ensuring delivery on time, within budget, and to required quality standards), Cost-Estimation & Budget Control (accurate calculation and ongoing management of project expenses with financial oversight to prevent budget overruns), Claims & Submissions (preparation and processing of contractual claims including variations, time extensions, and payment requests with full compliance documentation), and Report Writing (customized technical reports throughout project phases for stakeholders, regulatory bodies, and project teams).' },
      { heading: 'Industries Served', content: 'Toggle providers serve clients across 11 major sectors: Banking & Financial Services, Healthcare & Insurance, Retail & eCommerce, Automotive & Manufacturing, Energy & Utilities, Food & Agro-processing, Information Technology & Communications, Business Process Outsourcing, Property & Construction, Leisure & Entertainment, and Management Consulting. Service providers are matched to clients based on industry expertise, jurisdiction, and specific engagement requirements.' },
      { heading: 'Quality Assurance', content: 'All services facilitated through Toggle are subject to: provider qualification verification (licenses, certifications, professional body memberships), engagement-level quality reviews (client satisfaction surveys, deliverable assessments), ongoing performance monitoring (response times, completion rates, client ratings), and continuous improvement programs. Toggle information security measures are aligned with trust standards covering security, availability, processing integrity, confidentiality, and privacy.' },
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
          <p className="mt-1">Powered by SA &middot; <a href="https://poweredbysa.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700">poweredbysa.com</a></p>
        </div>
      </div>
    </div>
  )
}
