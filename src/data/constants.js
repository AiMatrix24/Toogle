export const serviceCategories = [
  'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Landscaping', 'Painting',
  'Roofing', 'Auto Repair', 'Pest Control', 'Moving', 'Handyman', 'Locksmith'
]

export const serviceSubcategories = {
  Plumbing: ['Leak Repair', 'Drain Cleaning', 'Water Heater', 'Pipe Replacement', 'Fixture Install', 'Sewer Line', 'Gas Line', 'Bathroom Remodel'],
  Electrical: ['Panel Upgrade', 'Outlet Install', 'Lighting', 'Rewiring', 'EV Charger', 'Generator', 'Smart Home', 'Ceiling Fan'],
  HVAC: ['AC Repair', 'Furnace Repair', 'Duct Cleaning', 'System Install', 'Maintenance', 'Heat Pump', 'Thermostat', 'Air Quality'],
  Cleaning: ['Deep Cleaning', 'Regular Maintenance', 'Move-In/Out', 'Office Cleaning', 'Carpet Cleaning', 'Window Cleaning', 'Post-Construction'],
  Landscaping: ['Lawn Care', 'Garden Design', 'Tree Trimming', 'Irrigation', 'Hardscaping', 'Snow Removal', 'Fence Install'],
  Painting: ['Interior', 'Exterior', 'Cabinet Refinishing', 'Deck Staining', 'Wallpaper', 'Pressure Washing', 'Drywall Repair'],
  Roofing: ['Roof Repair', 'Roof Replacement', 'Gutter Install', 'Gutter Cleaning', 'Skylight Install', 'Leak Detection', 'Insulation'],
  'Auto Repair': ['Oil Change', 'Brake Service', 'Engine Repair', 'Transmission', 'Tire Service', 'AC Repair', 'Diagnostic', 'Detailing'],
  'Pest Control': ['General Pest', 'Termite', 'Rodent', 'Bed Bug', 'Mosquito', 'Wildlife Removal', 'Fumigation', 'Prevention'],
  Moving: ['Local Moving', 'Long Distance', 'Packing', 'Loading Only', 'Storage', 'Junk Removal', 'Piano Moving', 'Commercial'],
  Handyman: ['Furniture Assembly', 'Drywall Repair', 'Door Install', 'Shelving', 'TV Mount', 'Minor Plumbing', 'Minor Electrical', 'General Repair'],
  Locksmith: ['Lockout Service', 'Lock Rekey', 'Lock Install', 'Key Duplication', 'Smart Lock', 'Safe Opening', 'Commercial', 'Auto Locksmith'],
}

export const propertyTypes = [
  { value: 'house', label: 'Single Family Home' },
  { value: 'apartment', label: 'Apartment / Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'commercial', label: 'Commercial / Office' },
  { value: 'mobile', label: 'Mobile Home' },
  { value: 'other', label: 'Other' },
]

export const urgencyLevels = [
  { value: 'standard', label: 'Standard (within a few days)', multiplier: 1.0 },
  { value: 'priority', label: 'Priority (same day / next day)', multiplier: 1.25 },
  { value: 'emergency', label: 'Emergency (ASAP - within hours)', multiplier: 1.5 },
]
