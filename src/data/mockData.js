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
    distance: 1.2, phone: '(555) 123-4567', favoriteCount: 89,
    portfolio: [
      { id: 1, title: 'Kitchen Faucet Replacement', description: 'Replaced corroded faucet with new Moen fixture', service: 'Fixture Installation', date: '2026-03-15', beforeColor: '#8B4513', afterColor: '#4682B4', beforeLabel: 'Corroded faucet, water damage visible', afterLabel: 'New Moen fixture, clean finish' },
      { id: 2, title: 'Slab Leak Repair', description: 'Detected and repaired slab leak without demolition', service: 'Leak Repair', date: '2026-02-28', beforeColor: '#654321', afterColor: '#228B22', beforeLabel: 'Water pooling, cracked foundation', afterLabel: 'Sealed and dry, no more leaks' },
    ],
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
    distance: 2.4, phone: '(555) 234-5678', favoriteCount: 67,
    portfolio: [
      { id: 1, title: 'EV Charger Installation', description: 'Level 2 charger installed in residential garage', service: 'EV Charger Install', date: '2026-03-10', beforeColor: '#696969', afterColor: '#00CED1', beforeLabel: 'Empty garage wall, no outlet', afterLabel: 'Tesla Wall Connector installed, wired to panel' },
    ],
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
    distance: 3.1, phone: '(555) 345-6789', favoriteCount: 43,
    portfolio: [
      { id: 1, title: 'Full HVAC System Replacement', description: 'Removed 20-year old system, installed energy-efficient unit', service: 'System Install', date: '2026-02-20', beforeColor: '#A0522D', afterColor: '#87CEEB', beforeLabel: 'Outdated, noisy HVAC unit', afterLabel: 'New Carrier Infinity system installed' },
    ],
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
    distance: 0.8, phone: '(555) 456-7890', favoriteCount: 124,
    portfolio: [
      { id: 1, title: 'Move-Out Deep Clean', description: 'Complete apartment cleaning for move-out inspection', service: 'Move-In/Move-Out', date: '2026-03-05', beforeColor: '#8B8682', afterColor: '#F5F5DC', beforeLabel: 'Dusty surfaces, stained carpet', afterLabel: 'Spotless, passed inspection' },
      { id: 2, title: 'Office Space Transformation', description: '5000 sq ft office deep clean', service: 'Office Cleaning', date: '2026-02-15', beforeColor: '#778899', afterColor: '#FFFACD', beforeLabel: 'Cluttered, dusty office space', afterLabel: 'Pristine, organized workspace' },
    ],
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
    distance: 4.2, phone: '(555) 567-8901', favoriteCount: 31,
    portfolio: [
      { id: 1, title: 'Backyard Redesign', description: 'Complete backyard transformation with patio and garden', service: 'Garden Design', date: '2026-03-01', beforeColor: '#8B7355', afterColor: '#32CD32', beforeLabel: 'Bare dirt, overgrown weeds', afterLabel: 'Lush garden with stone patio' },
    ],
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
    distance: 5.5, phone: '(555) 678-9012', favoriteCount: 22,
    portfolio: [
      { id: 1, title: 'Living Room Makeover', description: 'Accent wall with Benjamin Moore premium paint', service: 'Interior Painting', date: '2026-02-25', beforeColor: '#D2B48C', afterColor: '#4169E1', beforeLabel: 'Faded beige walls, scuff marks', afterLabel: 'Rich navy accent wall, crisp trim' },
      { id: 2, title: 'Exterior Home Repaint', description: 'Full exterior repaint with 10-year warranty', service: 'Exterior Painting', date: '2026-01-15', beforeColor: '#808080', afterColor: '#F0E68C', beforeLabel: 'Peeling gray paint, sun damage', afterLabel: 'Fresh warm yellow, new trim color' },
    ],
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
  { id: 'SC-2026-001', provider: 'Mike\'s Plumbing Pro', providerId: 1, customer: 'John D.', service: 'Leak Repair', amount: 120, status: 'completed', date: '2026-03-20', blockchainHash: '0x7a3b...e4f2' },
  { id: 'SC-2026-002', provider: 'Spark Electric Solutions', providerId: 2, customer: 'John D.', service: 'Outlet Installation', amount: 190, status: 'in-progress', date: '2026-03-25', blockchainHash: '0x9c1d...b8a3' },
  { id: 'SC-2026-003', provider: 'Pristine Clean Co.', providerId: 4, customer: 'John D.', service: 'Deep Cleaning', amount: 165, status: 'pending', date: '2026-03-27', blockchainHash: '0x2e5f...c7d1' }
]

export const mockDeals = [
  { id: 1, providerId: 3, title: 'Spring AC Tune-Up', description: 'Complete AC system check, filter replacement, and performance optimization', originalPrice: 110, dealPrice: 82, percentOff: 25, category: 'HVAC', expiresIn: 86400000 * 3, claimedCount: 18, maxClaims: 30 },
  { id: 2, providerId: 4, title: 'First-Time Deep Clean Special', description: 'Full home deep cleaning with eco-friendly products. New customers only!', originalPrice: 55, dealPrice: 40, percentOff: 27, category: 'Cleaning', expiresIn: 86400000 * 5, claimedCount: 24, maxClaims: 50 },
  { id: 3, providerId: 2, title: 'Free Electrical Inspection', description: 'Complimentary whole-home electrical safety inspection with any repair booking', originalPrice: 95, dealPrice: 0, percentOff: 100, category: 'Electrical', expiresIn: 86400000 * 2, claimedCount: 12, maxClaims: 20 },
  { id: 4, providerId: 1, title: 'Drain Cleaning Bundle', description: 'Clean up to 3 drains for the price of 1. Includes camera inspection', originalPrice: 255, dealPrice: 120, percentOff: 53, category: 'Plumbing', expiresIn: 86400000 * 7, claimedCount: 8, maxClaims: 25 },
  { id: 5, providerId: 5, title: 'Spring Lawn Revival Package', description: 'Full lawn aeration, overseeding, and fertilization treatment', originalPrice: 195, dealPrice: 130, percentOff: 33, category: 'Landscaping', expiresIn: 86400000 * 4, claimedCount: 6, maxClaims: 15 },
  { id: 6, providerId: 6, title: 'Interior Room Repaint Special', description: 'One room painted with premium Benjamin Moore paint. Includes prep and cleanup', originalPrice: 350, dealPrice: 245, percentOff: 30, category: 'Painting', expiresIn: 3600000 * 18, claimedCount: 4, maxClaims: 10 },
  { id: 7, providerId: 4, title: 'Weekly Cleaning Subscription', description: 'Sign up for 4 weekly cleanings and get the 5th FREE', originalPrice: 275, dealPrice: 220, percentOff: 20, category: 'Cleaning', expiresIn: 86400000 * 10, claimedCount: 31, maxClaims: 40 },
  { id: 8, providerId: 1, title: 'Water Heater Flush & Check', description: 'Annual water heater maintenance to extend life and improve efficiency', originalPrice: 150, dealPrice: 89, percentOff: 41, category: 'Plumbing', expiresIn: 3600000 * 6, claimedCount: 14, maxClaims: 20 },
]

export const mockSchedule = [
  { id: 1, providerId: 1, customer: 'Sarah M.', service: 'Leak Repair', date: '2026-03-28', startTime: '09:00', endTime: '10:30', status: 'confirmed', notes: 'Kitchen faucet leak' },
  { id: 2, providerId: 1, customer: 'James K.', service: 'Drain Cleaning', date: '2026-03-28', startTime: '11:00', endTime: '12:00', status: 'confirmed', notes: 'Bathroom drain slow' },
  { id: 3, providerId: 1, customer: 'Tom W.', service: 'Water Heater Install', date: '2026-03-28', startTime: '14:00', endTime: '17:00', status: 'pending', notes: '50 gal tank replacement' },
  { id: 4, providerId: 1, customer: 'Linda P.', service: 'Pipe Replacement', date: '2026-03-29', startTime: '08:00', endTime: '11:00', status: 'confirmed', notes: 'Copper pipe in basement' },
  { id: 5, providerId: 1, customer: 'Rick B.', service: 'Fixture Installation', date: '2026-03-29', startTime: '13:00', endTime: '14:30', status: 'confirmed', notes: 'New bathroom faucet' },
  { id: 6, providerId: 1, customer: 'Nancy S.', service: 'Leak Repair', date: '2026-03-30', startTime: '10:00', endTime: '11:00', status: 'pending', notes: 'Outdoor spigot' },
  { id: 7, providerId: 1, customer: 'Amy W.', service: 'Drain Cleaning', date: '2026-03-31', startTime: '09:00', endTime: '10:00', status: 'confirmed', notes: 'Kitchen garbage disposal' },
  { id: 8, providerId: 1, customer: 'Dave L.', service: 'Water Heater Install', date: '2026-04-01', startTime: '08:00', endTime: '12:00', status: 'confirmed', notes: 'Tankless install' },
  { id: 9, providerId: 1, customer: 'Carol T.', service: 'Fixture Installation', date: '2026-04-02', startTime: '14:00', endTime: '15:30', status: 'pending', notes: 'Kitchen sink sprayer' },
  { id: 10, providerId: 1, customer: 'Phil H.', service: 'Pipe Replacement', date: '2026-04-03', startTime: '09:00', endTime: '13:00', status: 'confirmed', notes: 'Main water line section' },
]

export const mockEarnings = {
  monthlyRevenue: [3200, 4100, 3800, 4500, 5200, 4800],
  monthLabels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  totalJobs: 142, avgJobValue: 127, repeatCustomerRate: 34, cancellationRate: 3,
  serviceRevenue: [
    { service: 'Leak Repair', revenue: 8500, jobs: 45 },
    { service: 'Drain Cleaning', revenue: 5200, jobs: 38 },
    { service: 'Water Heater Install', revenue: 7800, jobs: 22 },
    { service: 'Pipe Replacement', revenue: 4600, jobs: 18 },
    { service: 'Fixture Installation', revenue: 3400, jobs: 19 },
  ],
  payouts: [
    { id: 1, date: '2026-03-24', amount: 1250, status: 'paid', method: 'Samiteon' },
    { id: 2, date: '2026-03-17', amount: 980, status: 'paid', method: 'Samiteon' },
    { id: 3, date: '2026-03-10', amount: 1100, status: 'paid', method: 'Samiteon' },
    { id: 4, date: '2026-03-03', amount: 870, status: 'paid', method: 'Samiteon' },
    { id: 5, date: '2026-03-28', amount: 1400, status: 'processing', method: 'Samiteon' },
  ]
}

export const mockRewards = {
  points: 1850, tier: 'Silver',
  tierThresholds: { Bronze: 0, Silver: 500, Gold: 1500, Platinum: 3000 },
  history: [
    { id: 1, action: 'Completed booking with Mike\'s Plumbing Pro', points: 100, date: '2026-03-20', type: 'earn' },
    { id: 2, action: 'Left review for Mike\'s Plumbing Pro', points: 50, date: '2026-03-20', type: 'earn' },
    { id: 3, action: 'Completed booking with Spark Electric Solutions', points: 100, date: '2026-03-15', type: 'earn' },
    { id: 4, action: 'First booking with new provider bonus', points: 75, date: '2026-03-15', type: 'earn' },
    { id: 5, action: 'Referred friend: Alex M.', points: 200, date: '2026-03-10', type: 'earn' },
    { id: 6, action: 'Redeemed: $10 off booking', points: -500, date: '2026-03-08', type: 'redeem' },
    { id: 7, action: 'Completed booking with Pristine Clean Co.', points: 100, date: '2026-03-05', type: 'earn' },
    { id: 8, action: 'Left review for Pristine Clean Co.', points: 50, date: '2026-03-05', type: 'earn' },
    { id: 9, action: 'Referred friend: Sam T.', points: 200, date: '2026-02-28', type: 'earn' },
    { id: 10, action: 'Completed booking with CoolBreeze HVAC', points: 100, date: '2026-02-20', type: 'earn' },
  ]
}

export const mockReferrals = {
  code: 'JOHN-TGL-2026',
  totalReferrals: 4, pendingReferrals: 1, earnedCredit: 100, successfulConversions: 3,
  history: [
    { id: 1, name: 'Alex M.', date: '2026-03-10', status: 'Credit Earned', reward: 25 },
    { id: 2, name: 'Sam T.', date: '2026-02-28', status: 'Credit Earned', reward: 25 },
    { id: 3, name: 'Kim L.', date: '2026-02-15', status: 'Credit Earned', reward: 25 },
    { id: 4, name: 'Pat R.', date: '2026-03-25', status: 'Signed Up', reward: 0 },
  ],
  leaderboard: [
    { rank: 1, name: 'Jessica W.', referrals: 12, reward: 300 },
    { rank: 2, name: 'Marcus D.', referrals: 9, reward: 225 },
    { rank: 3, name: 'John D.', referrals: 4, reward: 100 },
    { rank: 4, name: 'Priya K.', referrals: 3, reward: 75 },
    { rank: 5, name: 'Chris L.', referrals: 2, reward: 50 },
  ]
}

export const mockTimeline = [
  { id: 1, type: 'booking', title: 'Booked Leak Repair', provider: 'Mike\'s Plumbing Pro', providerId: 1, date: '2026-03-20', time: '9:00 AM', cost: 120, status: 'completed', rating: 5 },
  { id: 2, type: 'payment', title: 'Payment Processed', provider: 'Mike\'s Plumbing Pro', providerId: 1, date: '2026-03-20', time: '11:30 AM', cost: 120, status: 'completed' },
  { id: 3, type: 'review', title: 'Left 5-Star Review', provider: 'Mike\'s Plumbing Pro', providerId: 1, date: '2026-03-20', time: '2:00 PM', text: 'Fixed our leak in under an hour!' },
  { id: 4, type: 'message', title: 'Messaged Spark Electric', provider: 'Spark Electric Solutions', providerId: 2, date: '2026-03-14', time: '3:15 PM', text: 'Asked about EV charger installation' },
  { id: 5, type: 'booking', title: 'Booked Outlet Installation', provider: 'Spark Electric Solutions', providerId: 2, date: '2026-03-15', time: '10:00 AM', cost: 190, status: 'in-progress' },
  { id: 6, type: 'payment', title: 'Payment Processed', provider: 'Spark Electric Solutions', providerId: 2, date: '2026-03-15', time: '10:05 AM', cost: 190, status: 'completed' },
  { id: 7, type: 'booking', title: 'Booked Deep Cleaning', provider: 'Pristine Clean Co.', providerId: 4, date: '2026-03-05', time: '8:00 AM', cost: 165, status: 'completed', rating: 5 },
  { id: 8, type: 'payment', title: 'Payment Processed', provider: 'Pristine Clean Co.', providerId: 4, date: '2026-03-05', time: '12:00 PM', cost: 165, status: 'completed' },
  { id: 9, type: 'review', title: 'Left 5-Star Review', provider: 'Pristine Clean Co.', providerId: 4, date: '2026-03-05', time: '5:00 PM', text: 'Amazing attention to detail!' },
  { id: 10, type: 'referral', title: 'Referred Alex M.', date: '2026-03-10', time: '11:00 AM', text: 'Friend signed up and earned $25 credit' },
  { id: 11, type: 'reward', title: 'Earned 200 Points', date: '2026-03-10', time: '11:05 AM', text: 'Referral bonus credited' },
  { id: 12, type: 'booking', title: 'Booked HVAC Maintenance', provider: 'CoolBreeze HVAC', providerId: 3, date: '2026-02-20', time: '9:00 AM', cost: 220, status: 'completed', rating: 4 },
  { id: 13, type: 'payment', title: 'Payment Processed', provider: 'CoolBreeze HVAC', providerId: 3, date: '2026-02-20', time: '1:00 PM', cost: 220, status: 'completed' },
  { id: 14, type: 'message', title: 'Messaged GreenScape', provider: 'GreenScape Landscaping', providerId: 5, date: '2026-02-10', time: '4:00 PM', text: 'Inquired about spring lawn care' },
  { id: 15, type: 'reward', title: 'Redeemed $10 Off', date: '2026-03-08', time: '9:30 AM', text: 'Used 500 points for booking discount' },
]
