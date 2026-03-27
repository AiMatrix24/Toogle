export const serviceCategories = [
  'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Landscaping', 'Painting',
  'Roofing', 'Auto Repair', 'Pest Control', 'Moving', 'Handyman', 'Locksmith'
]

export const mockProviders = [
  {
    id: 1, name: 'Mike\'s Plumbing Pro', category: 'Plumbing', avatar: null,
    available: true, rating: 4.8, reviewCount: 234, responseTime: '< 15 min',
    hourlyRate: 85, description: 'Licensed master plumber with 15+ years of experience. Emergency services available 24/7.',
    services: ['Leak Repair', 'Drain Cleaning', 'Water Heater Install', 'Pipe Replacement', 'Fixture Installation'],
    hours: { open: '7:00 AM', close: '9:00 PM', days: 'Mon-Sat' },
    location: { lat: 34.0522, lng: -118.2437, address: '1234 Main St, Los Angeles, CA 90012' },
    distance: 1.2, phone: '(555) 123-4567',
    reviews: [
      { id: 1, user: 'Sarah M.', rating: 5, text: 'Fixed our leak in under an hour. Professional and clean work!', date: '2026-03-20' },
      { id: 2, user: 'James K.', rating: 5, text: 'Great price and even better service. Highly recommend!', date: '2026-03-15' },
      { id: 3, user: 'Linda P.', rating: 4, text: 'Good work, arrived on time. Slightly pricey but worth it.', date: '2026-03-10' }
    ],
    blog: [
      { id: 1, title: '5 Signs You Need to Replace Your Water Heater', date: '2026-03-18', excerpt: 'Your water heater won\'t last forever. Here are the warning signs...' },
      { id: 2, title: 'Preventing Frozen Pipes This Winter', date: '2026-02-10', excerpt: 'Frozen pipes can cause thousands in damage. Learn how to protect your home...' }
    ],
    media: [
      { id: 1, type: 'video', title: 'How We Fix Slab Leaks', url: '#' },
      { id: 2, type: 'podcast', title: 'Home Plumbing Tips Ep. 12', url: '#' }
    ]
  },
  {
    id: 2, name: 'Spark Electric Solutions', category: 'Electrical', avatar: null,
    available: true, rating: 4.9, reviewCount: 189, responseTime: '< 30 min',
    hourlyRate: 95, description: 'Full-service electrical contractor. Residential and commercial. Licensed, bonded, insured.',
    services: ['Panel Upgrades', 'Outlet Installation', 'Lighting', 'Rewiring', 'EV Charger Install'],
    hours: { open: '8:00 AM', close: '6:00 PM', days: 'Mon-Fri' },
    location: { lat: 34.0625, lng: -118.2350, address: '567 Electric Ave, Los Angeles, CA 90014' },
    distance: 2.4, phone: '(555) 234-5678',
    reviews: [
      { id: 1, user: 'Tom R.', rating: 5, text: 'Installed our EV charger perfectly. Clean, fast, professional.', date: '2026-03-22' },
      { id: 2, user: 'Amy W.', rating: 5, text: 'Best electrician we\'ve ever used. Fair pricing.', date: '2026-03-12' }
    ],
    blog: [
      { id: 1, title: 'Is Your Home Ready for an EV Charger?', date: '2026-03-15', excerpt: 'Electric vehicles are the future. Make sure your electrical panel can handle it...' }
    ],
    media: [
      { id: 1, type: 'video', title: 'Panel Upgrade Walkthrough', url: '#' }
    ]
  },
  {
    id: 3, name: 'CoolBreeze HVAC', category: 'HVAC', avatar: null,
    available: false, rating: 4.6, reviewCount: 156, responseTime: '< 1 hr',
    hourlyRate: 110, description: 'Heating, ventilation, and air conditioning specialists. Installations, repairs, and maintenance.',
    services: ['AC Repair', 'Furnace Repair', 'Duct Cleaning', 'System Install', 'Maintenance Plans'],
    hours: { open: '8:00 AM', close: '5:00 PM', days: 'Mon-Fri' },
    location: { lat: 34.0450, lng: -118.2600, address: '890 Cool St, Los Angeles, CA 90015' },
    distance: 3.1, phone: '(555) 345-6789',
    reviews: [
      { id: 1, user: 'Dave L.', rating: 5, text: 'Replaced our entire HVAC system. Excellent work and fair price.', date: '2026-03-19' },
      { id: 2, user: 'Maria G.', rating: 4, text: 'Good service but had to wait a day for appointment.', date: '2026-03-05' }
    ],
    blog: [], media: []
  },
  {
    id: 4, name: 'Pristine Clean Co.', category: 'Cleaning', avatar: null,
    available: true, rating: 4.7, reviewCount: 312, responseTime: '< 20 min',
    hourlyRate: 55, description: 'Professional home and office cleaning. Eco-friendly products. Satisfaction guaranteed.',
    services: ['Deep Cleaning', 'Regular Maintenance', 'Move-In/Move-Out', 'Office Cleaning', 'Carpet Cleaning'],
    hours: { open: '6:00 AM', close: '8:00 PM', days: 'Mon-Sun' },
    location: { lat: 34.0580, lng: -118.2500, address: '321 Clean Blvd, Los Angeles, CA 90013' },
    distance: 0.8, phone: '(555) 456-7890',
    reviews: [
      { id: 1, user: 'Nancy S.', rating: 5, text: 'Our house has never looked better! Amazing attention to detail.', date: '2026-03-21' },
      { id: 2, user: 'Rick B.', rating: 5, text: 'Reliable, thorough, and reasonably priced. Our go-to cleaners!', date: '2026-03-14' }
    ],
    blog: [
      { id: 1, title: 'Spring Cleaning Checklist 2026', date: '2026-03-01', excerpt: 'Get your home ready for spring with our comprehensive checklist...' }
    ],
    media: [
      { id: 1, type: 'video', title: 'Our Eco-Friendly Cleaning Process', url: '#' },
      { id: 2, type: 'audio', title: 'Clean Living Podcast Ep. 5', url: '#' }
    ]
  },
  {
    id: 5, name: 'GreenScape Landscaping', category: 'Landscaping', avatar: null,
    available: true, rating: 4.5, reviewCount: 98, responseTime: '< 45 min',
    hourlyRate: 65, description: 'Transform your outdoor space. Design, installation, and maintenance services.',
    services: ['Lawn Care', 'Garden Design', 'Tree Trimming', 'Irrigation', 'Hardscaping'],
    hours: { open: '7:00 AM', close: '5:00 PM', days: 'Mon-Sat' },
    location: { lat: 34.0700, lng: -118.2300, address: '654 Garden Way, Los Angeles, CA 90016' },
    distance: 4.2, phone: '(555) 567-8901',
    reviews: [
      { id: 1, user: 'Carol T.', rating: 5, text: 'Beautiful garden design. Transformed our backyard completely!', date: '2026-03-18' }
    ],
    blog: [], media: []
  },
  {
    id: 6, name: 'Perfect Coat Painters', category: 'Painting', avatar: null,
    available: false, rating: 4.4, reviewCount: 76, responseTime: '< 2 hrs',
    hourlyRate: 70, description: 'Interior and exterior painting. Color consultation included. Premium paints only.',
    services: ['Interior Painting', 'Exterior Painting', 'Cabinet Refinishing', 'Deck Staining', 'Wallpaper'],
    hours: { open: '8:00 AM', close: '6:00 PM', days: 'Mon-Fri' },
    location: { lat: 34.0400, lng: -118.2700, address: '789 Color Ln, Los Angeles, CA 90017' },
    distance: 5.5, phone: '(555) 678-9012',
    reviews: [
      { id: 1, user: 'Phil H.', rating: 4, text: 'Great color matching and clean lines. A bit slow but quality work.', date: '2026-03-16' }
    ],
    blog: [], media: []
  }
]

export const mockMessages = [
  { id: 1, from: 'customer', text: 'Hi, I have a leaky faucet in my kitchen. Can you come today?', time: '10:30 AM' },
  { id: 2, from: 'provider', text: 'Hi there! Yes, I\'m available this afternoon. Can you send a photo of the faucet?', time: '10:32 AM' },
  { id: 3, from: 'customer', text: 'Sure, it\'s a single-handle Moen faucet, dripping from the base.', time: '10:35 AM' },
  { id: 4, from: 'provider', text: 'Got it. That\'s likely a cartridge issue. I can be there by 2 PM. The repair should take about 30 min and cost around $85-$120. Want me to come by?', time: '10:37 AM' },
]

export const mockContracts = [
  { id: 'SC-2026-001', provider: 'Mike\'s Plumbing Pro', customer: 'John D.', service: 'Leak Repair', amount: 120, status: 'completed', date: '2026-03-20', blockchainHash: '0x7a3b...e4f2' },
  { id: 'SC-2026-002', provider: 'Spark Electric Solutions', customer: 'John D.', service: 'Outlet Installation', amount: 190, status: 'in-progress', date: '2026-03-25', blockchainHash: '0x9c1d...b8a3' },
  { id: 'SC-2026-003', provider: 'Pristine Clean Co.', customer: 'John D.', service: 'Deep Cleaning', amount: 165, status: 'pending', date: '2026-03-27', blockchainHash: '0x2e5f...c7d1' }
]
