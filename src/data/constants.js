// ============================================================
// TOGGLE Complete Service Category Directory
// 12 Verticals | 87+ Categories | Powered by SA Integration
// ============================================================

export const serviceVerticals = {
  home_repair: {
    label: 'Home Repair & Maintenance',
    icon: 'Wrench',
    categories: [
      { name: 'Plumbing', pricing: 'hourly', geofence: 15, urgency: ['emergency', 'same-day', 'scheduled'] },
      { name: 'Electrical Work', pricing: 'hourly', geofence: 15, urgency: ['emergency', 'same-day', 'scheduled'] },
      { name: 'HVAC', pricing: 'hourly', geofence: 20, urgency: ['emergency', 'same-day', 'scheduled'] },
      { name: 'General Handyman', pricing: 'hourly', geofence: 10, urgency: ['same-day', 'scheduled'] },
      { name: 'Drywall Repair', pricing: 'flat', geofence: 15, urgency: ['same-day', 'scheduled'] },
      { name: 'Painting', pricing: 'flat', geofence: 15, urgency: ['scheduled'] },
      { name: 'Roofing', pricing: 'flat', geofence: 25, urgency: ['scheduled', 'emergency'] },
      { name: 'Appliance Repair', pricing: 'flat', geofence: 15, urgency: ['same-day', 'scheduled'] },
      { name: 'Garage Door Repair', pricing: 'flat', geofence: 15, urgency: ['emergency', 'same-day'] },
      { name: 'Pest Control', pricing: 'flat', geofence: 20, urgency: ['same-day', 'scheduled'] },
      { name: 'Locksmith', pricing: 'flat', geofence: 10, urgency: ['emergency', 'same-day'] },
    ]
  },
  construction: {
    label: 'Construction & Remodeling',
    icon: 'HardHat',
    categories: [
      { name: 'General Contractor', pricing: 'estimate', geofence: 25, urgency: ['scheduled'] },
      { name: 'Carpenter / Framing', pricing: 'hourly', geofence: 20, urgency: ['scheduled'] },
      { name: 'Construction Mechanic', pricing: 'hourly', geofence: 25, urgency: ['same-day', 'scheduled'] },
      { name: 'Concrete / Masonry', pricing: 'estimate', geofence: 25, urgency: ['scheduled'] },
      { name: 'Tile & Flooring', pricing: 'flat', geofence: 20, urgency: ['scheduled'] },
      { name: 'Kitchen Remodel', pricing: 'estimate', geofence: 20, urgency: ['scheduled'], phase: 2 },
      { name: 'Bathroom Remodel', pricing: 'estimate', geofence: 20, urgency: ['scheduled'], phase: 2 },
      { name: 'Deck / Fence', pricing: 'estimate', geofence: 25, urgency: ['scheduled'] },
      { name: 'Window / Door Install', pricing: 'flat', geofence: 20, urgency: ['scheduled'] },
    ]
  },
  technology: {
    label: 'Technology & Electronics',
    icon: 'Monitor',
    categories: [
      { name: 'Computer Repair', pricing: 'flat', geofence: 10, urgency: ['same-day', 'scheduled'] },
      { name: 'TV Mounting', pricing: 'flat', geofence: 10, urgency: ['same-day', 'scheduled'] },
      { name: 'Smart Home Setup', pricing: 'hourly', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Network / WiFi Install', pricing: 'hourly', geofence: 15, urgency: ['same-day', 'scheduled'], phase: 2 },
      { name: 'Home Theater Install', pricing: 'flat', geofence: 15, urgency: ['scheduled'], phase: 2 },
      { name: 'Security Camera Install', pricing: 'flat', geofence: 15, urgency: ['scheduled'], phase: 2 },
      { name: 'Phone / Tablet Repair', pricing: 'flat', geofence: 10, urgency: ['same-day', 'scheduled'], phase: 2 },
    ]
  },
  automotive: {
    label: 'Automotive Services',
    icon: 'Car',
    categories: [
      { name: 'Mobile Mechanic', pricing: 'hourly', geofence: 20, urgency: ['same-day', 'scheduled'] },
      { name: 'Oil Change / Fluids', pricing: 'flat', geofence: 15, urgency: ['same-day', 'scheduled'] },
      { name: 'Tire Service (Mobile)', pricing: 'flat', geofence: 15, urgency: ['emergency', 'same-day'], phase: 2 },
      { name: 'Auto Detailing', pricing: 'flat', geofence: 15, urgency: ['scheduled'] },
      { name: 'Windshield Repair', pricing: 'flat', geofence: 20, urgency: ['same-day'], phase: 2 },
      { name: 'Towing / Roadside', pricing: 'flat', geofence: 25, urgency: ['emergency'], phase: 2 },
    ]
  },
  beauty: {
    label: 'Beauty & Personal Care',
    icon: 'Scissors',
    phase: 2,
    categories: [
      { name: 'Hair Stylist (Mobile)', pricing: 'flat', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Barber (Mobile)', pricing: 'flat', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Nail Technician', pricing: 'flat', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Massage Therapist', pricing: 'hourly', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Makeup Artist', pricing: 'flat', geofence: 15, urgency: ['scheduled'], phase: 2 },
      { name: 'Personal Trainer', pricing: 'hourly', geofence: 10, urgency: ['scheduled'], phase: 2 },
    ]
  },
  pet: {
    label: 'Pet Services',
    icon: 'Dog',
    phase: 2,
    categories: [
      { name: 'Dog Walking', pricing: 'hourly', geofence: 5, urgency: ['same-day', 'scheduled'], phase: 2 },
      { name: 'Pet Sitting', pricing: 'flat', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Pet Grooming (Mobile)', pricing: 'flat', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Veterinarian (House Call)', pricing: 'consultation', geofence: 15, urgency: ['scheduled', 'emergency'], phase: 2 },
    ]
  },
  cleaning: {
    label: 'Cleaning & Landscaping',
    icon: 'Sparkles',
    categories: [
      { name: 'House Cleaning', pricing: 'flat', geofence: 10, urgency: ['same-day', 'scheduled'] },
      { name: 'Deep Cleaning', pricing: 'flat', geofence: 10, urgency: ['scheduled'] },
      { name: 'Move-In / Move-Out Clean', pricing: 'flat', geofence: 15, urgency: ['scheduled'] },
      { name: 'Lawn Mowing & Care', pricing: 'flat', geofence: 10, urgency: ['scheduled'] },
      { name: 'Landscaping Design', pricing: 'estimate', geofence: 20, urgency: ['scheduled'], phase: 2 },
      { name: 'Tree Trimming / Removal', pricing: 'estimate', geofence: 20, urgency: ['scheduled', 'emergency'], phase: 2 },
      { name: 'Pressure Washing', pricing: 'flat', geofence: 15, urgency: ['scheduled'] },
      { name: 'Pool Cleaning', pricing: 'flat', geofence: 15, urgency: ['scheduled'], phase: 2 },
      { name: 'Junk Removal', pricing: 'flat', geofence: 15, urgency: ['same-day', 'scheduled'] },
    ]
  },
  medical: {
    label: 'Medical & Healthcare',
    icon: 'Heart',
    phase: 2,
    categories: [
      { name: 'Family Medicine / PCP', pricing: 'consultation', geofence: 5, urgency: ['consultation', 'same-day'] },
      { name: 'Dentist', pricing: 'consultation', geofence: 5, urgency: ['consultation', 'same-day'] },
      { name: 'Chiropractor', pricing: 'consultation', geofence: 5, urgency: ['consultation', 'scheduled'] },
      { name: 'Optometrist', pricing: 'consultation', geofence: 10, urgency: ['consultation', 'scheduled'] },
      { name: 'Physical Therapist', pricing: 'hourly', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Mental Health', pricing: 'hourly', geofence: 10, urgency: ['consultation', 'scheduled'], phase: 2 },
      { name: 'Home Health Aide', pricing: 'hourly', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Urgent Care / Telemed', pricing: 'consultation', geofence: 0, urgency: ['emergency', 'same-day'], phase: 2 },
    ]
  },
  legal: {
    label: 'Legal Services',
    icon: 'Scale',
    categories: [
      { name: 'General Practice', pricing: 'consultation', geofence: 10, urgency: ['consultation', 'scheduled'] },
      { name: 'Family Law', pricing: 'consultation', geofence: 10, urgency: ['consultation', 'scheduled'] },
      { name: 'Real Estate Law', pricing: 'consultation', geofence: 10, urgency: ['consultation', 'scheduled'] },
      { name: 'Estate Planning / Wills', pricing: 'consultation', geofence: 15, urgency: ['scheduled'] },
      { name: 'Criminal Defense', pricing: 'consultation', geofence: 10, urgency: ['consultation'], phase: 2 },
      { name: 'Immigration', pricing: 'consultation', geofence: 0, urgency: ['consultation', 'scheduled'], phase: 2 },
      { name: 'Business / Corporate', pricing: 'consultation', geofence: 15, urgency: ['scheduled'], phase: 2 },
      { name: 'Notary Public', pricing: 'flat', geofence: 10, urgency: ['same-day', 'scheduled'] },
      // Powered by SA Legal Services
      { name: 'E-Discovery', pricing: 'hourly', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
      { name: 'Contract Lifecycle Management', pricing: 'hourly', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
      { name: 'Due Diligence', pricing: 'estimate', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
      { name: 'Legal Compliance & Forms', pricing: 'hourly', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
      { name: 'Dedicated Legal Resource Center', pricing: 'retainer', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
    ]
  },
  financial: {
    label: 'Financial Services & Insurance',
    icon: 'DollarSign',
    categories: [
      { name: 'Mortgage Broker', pricing: 'consultation', geofence: 0, urgency: ['consultation', 'scheduled'] },
      { name: 'Insurance Agent (P&C)', pricing: 'consultation', geofence: 0, urgency: ['consultation', 'scheduled'] },
      { name: 'Insurance Agent (Life)', pricing: 'consultation', geofence: 0, urgency: ['consultation', 'scheduled'] },
      { name: 'Financial Advisor', pricing: 'consultation', geofence: 0, urgency: ['consultation', 'scheduled'] },
      { name: 'Tax Preparer', pricing: 'flat', geofence: 15, urgency: ['scheduled'] },
      { name: 'CPA / Accountant', pricing: 'hourly', geofence: 15, urgency: ['scheduled'] },
      { name: 'Student Loan Advisor', pricing: 'consultation', geofence: 0, urgency: ['consultation', 'scheduled'], phase: 2 },
      { name: 'Credit Repair', pricing: 'flat', geofence: 0, urgency: ['scheduled'], phase: 2 },
      { name: 'Bookkeeper', pricing: 'hourly', geofence: 0, urgency: ['scheduled'], phase: 2 },
      // Powered by SA Finance Services
      { name: 'Core Financial Operations', pricing: 'retainer', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
      { name: 'Strategic Financial Operations', pricing: 'retainer', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
      { name: 'Global Payroll Management', pricing: 'retainer', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
      { name: 'Business Operational Call Center', pricing: 'retainer', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
    ]
  },
  it: {
    label: 'IT Services & Cybersecurity',
    icon: 'Shield',
    categories: [
      { name: 'IT Support / Helpdesk', pricing: 'hourly', geofence: 10, urgency: ['same-day', 'scheduled'] },
      { name: 'Cybersecurity Consultant', pricing: 'consultation', geofence: 0, urgency: ['consultation', 'scheduled'] },
      { name: 'Managed IT Services', pricing: 'retainer', geofence: 0, urgency: ['scheduled'], phase: 2 },
      { name: 'Cloud Migration', pricing: 'estimate', geofence: 0, urgency: ['scheduled'], phase: 2 },
      { name: 'Web Developer', pricing: 'estimate', geofence: 0, urgency: ['scheduled'], phase: 2 },
      { name: 'Data Recovery', pricing: 'flat', geofence: 15, urgency: ['emergency', 'same-day'], phase: 2 },
      // Powered by SA Technical Services
      { name: 'Project Management Support', pricing: 'retainer', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
      { name: 'Cost-Estimation & Budget Control', pricing: 'hourly', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
      { name: 'Claims & Submissions', pricing: 'hourly', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
      { name: 'Technical Report Writing', pricing: 'flat', geofence: 0, urgency: ['scheduled'], poweredBySA: true },
    ]
  },
  specialty: {
    label: 'Specialty & Lifestyle',
    icon: 'Star',
    categories: [
      { name: 'Jewelry Repair', pricing: 'flat', geofence: 10, urgency: ['scheduled'] },
      { name: 'Florist / Floral Design', pricing: 'flat', geofence: 10, urgency: ['same-day', 'scheduled'] },
      { name: 'Photographer', pricing: 'hourly', geofence: 15, urgency: ['scheduled'] },
      { name: 'Videographer', pricing: 'hourly', geofence: 20, urgency: ['scheduled'], phase: 2 },
      { name: 'DJ / Event Music', pricing: 'flat', geofence: 25, urgency: ['scheduled'], phase: 2 },
      { name: 'Moving Services', pricing: 'flat', geofence: 25, urgency: ['same-day', 'scheduled'] },
      { name: 'Interior Designer', pricing: 'consultation', geofence: 15, urgency: ['scheduled'], phase: 2 },
      { name: 'Tutor / Academic', pricing: 'hourly', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Music Teacher', pricing: 'hourly', geofence: 10, urgency: ['scheduled'], phase: 2 },
      { name: 'Personal Chef', pricing: 'flat', geofence: 15, urgency: ['scheduled'], phase: 2 },
      { name: 'Event Planner', pricing: 'consultation', geofence: 25, urgency: ['scheduled'], phase: 2 },
      { name: 'Tailor / Alterations', pricing: 'flat', geofence: 10, urgency: ['scheduled'], phase: 2 },
    ]
  },
}

// Flat list of all category names for dropdowns
export const serviceCategories = Object.values(serviceVerticals).flatMap(v =>
  v.categories.map(c => c.name)
)

// Industries served (Powered by SA)
export const industries = [
  'Banking & Financial Services', 'Healthcare & Insurance', 'Retail & eCommerce',
  'Automotive & Manufacturing', 'Energy & Utilities', 'Food & Agro-processing',
  'IT & Communications', 'Business Process Outsourcing', 'Property & Construction',
  'Leisure & Entertainment', 'Management Consulting',
]

export const propertyTypes = [
  { value: 'house', label: 'Single Family Home' },
  { value: 'apartment', label: 'Apartment / Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'commercial', label: 'Commercial / Office' },
  { value: 'corporate', label: 'Corporate Office' },
  { value: 'lawfirm', label: 'Law Firm' },
  { value: 'financial', label: 'Financial Institution' },
  { value: 'construction', label: 'Construction / Engineering Firm' },
  { value: 'government', label: 'Government / Public Sector' },
  { value: 'mobile', label: 'Mobile Home' },
  { value: 'other', label: 'Other' },
]

export const urgencyLevels = [
  { value: 'emergency', label: 'Emergency SOS (ASAP)', multiplier: 2.0 },
  { value: 'same-day', label: 'Same Day (within hours)', multiplier: 1.5 },
  { value: 'scheduled', label: 'Scheduled (1-7 days)', multiplier: 1.0 },
  { value: 'consultation', label: 'Consultation (flexible)', multiplier: 1.0 },
]

export const pricingModels = {
  hourly: 'Hourly Rate',
  flat: 'Flat Fee',
  estimate: 'Estimate / Bid',
  consultation: 'Consultation Fee',
  retainer: 'Retainer / Monthly',
}
