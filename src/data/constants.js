export const serviceCategories = [
  'E-Discovery', 'Contract Management', 'Due Diligence', 'Legal Compliance',
  'Core Finance', 'Strategic Finance', 'Global Payroll', 'Call Centers',
  'Project Management', 'Cost Estimation', 'Claims & Submissions', 'Report Writing'
]

export const serviceVerticals = {
  legal: {
    label: 'Legal Services',
    categories: ['E-Discovery', 'Contract Management', 'Due Diligence', 'Legal Compliance'],
    subcategories: {
      'E-Discovery': ['Document Review', 'Data Preservation', 'Evidence Processing', 'Litigation Support', 'Regulatory Response'],
      'Contract Management': ['Contract Drafting', 'Contract Negotiation', 'CLM Implementation', 'Compliance Tracking', 'Renewal Management'],
      'Due Diligence': ['M&A Due Diligence', 'Investment Due Diligence', 'Regulatory Due Diligence', 'Vendor Due Diligence', 'Real Estate Due Diligence'],
      'Legal Compliance': ['Form Completion', 'Regulatory Filings', 'Court Documents', 'Compliance Audits', 'Policy Review'],
    }
  },
  finance: {
    label: 'Finance Services',
    categories: ['Core Finance', 'Strategic Finance', 'Global Payroll', 'Call Centers'],
    subcategories: {
      'Core Finance': ['Accounts Payable', 'Accounts Receivable', 'General Ledger', 'Financial Reconciliation', 'Management Reporting'],
      'Strategic Finance': ['Financial Planning & Analysis', 'Budgeting & Forecasting', 'Business Intelligence', 'Treasury Management', 'Risk Analytics'],
      'Global Payroll': ['Multi-jurisdiction Payroll', 'Tax Calculations', 'Statutory Reporting', 'Benefits Administration', 'Payroll Compliance'],
      'Call Centers': ['Customer Service', 'Collections', 'Billing Inquiries', 'Account Management', 'Inbound/Outbound Operations'],
    }
  },
  technical: {
    label: 'Technical Services',
    categories: ['Project Management', 'Cost Estimation', 'Claims & Submissions', 'Report Writing'],
    subcategories: {
      'Project Management': ['Construction PM', 'Infrastructure PM', 'Schedule Management', 'Quality Assurance', 'Stakeholder Coordination'],
      'Cost Estimation': ['Budget Development', 'Cost Control', 'Variance Analysis', 'Value Engineering', 'Life Cycle Costing'],
      'Claims & Submissions': ['Variation Claims', 'Time Extension Claims', 'Payment Requests', 'Dispute Documentation', 'Contract Compliance'],
      'Report Writing': ['Progress Reports', 'Technical Assessments', 'Feasibility Studies', 'Compliance Reports', 'Executive Summaries'],
    }
  },
}

export const industries = [
  'Banking & Financial Services',
  'Healthcare & Insurance',
  'Retail & eCommerce',
  'Automotive & Manufacturing',
  'Energy & Utilities',
  'Food & Agro-processing',
  'IT & Communications',
  'Business Process Outsourcing',
  'Property & Construction',
  'Leisure & Entertainment',
  'Management Consulting',
]

export const propertyTypes = [
  { value: 'corporate', label: 'Corporate Office' },
  { value: 'lawfirm', label: 'Law Firm' },
  { value: 'financial', label: 'Financial Institution' },
  { value: 'construction', label: 'Construction / Engineering Firm' },
  { value: 'government', label: 'Government / Public Sector' },
  { value: 'other', label: 'Other' },
]

export const urgencyLevels = [
  { value: 'standard', label: 'Standard (5-10 business days)', multiplier: 1.0 },
  { value: 'priority', label: 'Priority (2-5 business days)', multiplier: 1.25 },
  { value: 'urgent', label: 'Urgent (24-48 hours)', multiplier: 1.5 },
  { value: 'emergency', label: 'Emergency (same day)', multiplier: 2.0 },
]
