import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './context/AuthContext'
import { providers as providersApi, users as usersApi } from './lib/api'
import Navbar from './components/Navbar'
import ToastContainer, { useToasts, useAutoToasts } from './components/ToastNotifications'
import Home from './pages/Home'
import ProviderPage from './pages/ProviderPage'
import ProviderDashboard from './pages/ProviderDashboard'
import Messages from './pages/Messages'
import Contracts from './pages/Contracts'
import QuoteEngine from './pages/QuoteEngine'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Booking from './pages/Booking'
import Checkout from './pages/Checkout'
import MapView from './pages/MapView'
import Onboarding from './pages/Onboarding'
import ReviewSubmit from './pages/ReviewSubmit'
import Support from './pages/Support'
import Analytics from './pages/Analytics'
import BlockchainExplorer from './pages/BlockchainExplorer'
import ReviewHub from './pages/ReviewHub'
import CompareProviders from './pages/CompareProviders'
import Emergency from './pages/Emergency'
import Deals from './pages/Deals'
import Rewards from './pages/Rewards'
import ServiceTimeline from './pages/ServiceTimeline'
import Referrals from './pages/Referrals'
import ForgotPassword from './pages/ForgotPassword'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Legal from './pages/Legal'
import Landing from './pages/Landing'
import Receipt from './pages/Receipt'
import LeadIntakeForm from './pages/LeadIntakeForm'
import PolicyUpload from './pages/PolicyUpload'
import PolicyReview from './pages/PolicyReview'
import AdminLeads from './pages/AdminLeads'
import ProviderAppointmentQueue from './pages/ProviderAppointmentQueue'

export default function App() {
  const { user, logout, loading: authLoading } = useAuth()
  const [providers, setProviders] = useState([])
  const [favorites, setFavorites] = useState([])
  const [compareList, setCompareList] = useState([])
  const [rewardsPoints, setRewardsPoints] = useState(0)
  const { toasts, addToast, removeToast } = useToasts()

  // Demo fallback data when API is unavailable (Vercel static deploy)
  const demoProviders = [
    { id: 'demo-1', name: "Mike's Plumbing Pro", category: 'Plumbing', avatar: null, available: true, rating: 4.8, reviewCount: 234, responseTime: '< 15 min', hourlyRate: 85, description: 'Licensed master plumber with 15+ years of experience. Emergency services available 24/7.', services: ['Leak Repair', 'Drain Cleaning', 'Water Heater Install', 'Pipe Replacement', 'Fixture Installation'], hours: { open: '7:00 AM', close: '9:00 PM', days: 'Mon-Sat' }, location: { lat: 34.0522, lng: -118.2437, address: '1234 Main St, Los Angeles, CA 90012' }, distance: 1.2, phone: '(555) 123-4567', favoriteCount: 89, portfolio: [], reviews: [], blog: [], media: [] },
    { id: 'demo-2', name: 'Spark Electric Solutions', category: 'Electrical', avatar: null, available: true, rating: 4.9, reviewCount: 189, responseTime: '< 30 min', hourlyRate: 95, description: 'Full-service electrical contractor. Residential and commercial. Licensed, bonded, insured.', services: ['Panel Upgrades', 'Outlet Installation', 'Lighting', 'Rewiring', 'EV Charger Install'], hours: { open: '8:00 AM', close: '6:00 PM', days: 'Mon-Fri' }, location: { lat: 34.0625, lng: -118.2350, address: '567 Electric Ave, Los Angeles, CA 90014' }, distance: 2.4, phone: '(555) 234-5678', favoriteCount: 67, portfolio: [], reviews: [], blog: [], media: [] },
    { id: 'demo-3', name: 'CoolBreeze HVAC', category: 'HVAC', avatar: null, available: false, rating: 4.6, reviewCount: 156, responseTime: '< 1 hr', hourlyRate: 110, description: 'Heating, ventilation, and air conditioning specialists.', services: ['AC Repair', 'Furnace Repair', 'Duct Cleaning', 'System Install', 'Maintenance Plans'], hours: { open: '8:00 AM', close: '5:00 PM', days: 'Mon-Fri' }, location: { lat: 34.0450, lng: -118.2600, address: '890 Cool St, Los Angeles, CA 90015' }, distance: 3.1, phone: '(555) 345-6789', favoriteCount: 43, portfolio: [], reviews: [], blog: [], media: [] },
    { id: 'demo-4', name: 'Pristine Clean Co.', category: 'Cleaning', avatar: null, available: true, rating: 4.7, reviewCount: 312, responseTime: '< 20 min', hourlyRate: 55, description: 'Professional home and office cleaning. Eco-friendly products. Satisfaction guaranteed.', services: ['Deep Cleaning', 'Regular Maintenance', 'Move-In/Move-Out', 'Office Cleaning', 'Carpet Cleaning'], hours: { open: '6:00 AM', close: '8:00 PM', days: 'Mon-Sun' }, location: { lat: 34.0580, lng: -118.2500, address: '321 Clean Blvd, Los Angeles, CA 90013' }, distance: 0.8, phone: '(555) 456-7890', favoriteCount: 124, portfolio: [], reviews: [], blog: [], media: [] },
    { id: 'demo-5', name: 'GreenScape Landscaping', category: 'Landscaping', avatar: null, available: true, rating: 4.5, reviewCount: 98, responseTime: '< 45 min', hourlyRate: 65, description: 'Transform your outdoor space. Design, installation, and maintenance services.', services: ['Lawn Care', 'Garden Design', 'Tree Trimming', 'Irrigation', 'Hardscaping'], hours: { open: '7:00 AM', close: '5:00 PM', days: 'Mon-Sat' }, location: { lat: 34.0700, lng: -118.2300, address: '654 Garden Way, Los Angeles, CA 90016' }, distance: 4.2, phone: '(555) 567-8901', favoriteCount: 31, portfolio: [], reviews: [], blog: [], media: [] },
    { id: 'demo-6', name: 'Perfect Coat Painters', category: 'Painting', avatar: null, available: false, rating: 4.4, reviewCount: 76, responseTime: '< 2 hrs', hourlyRate: 70, description: 'Interior and exterior painting. Color consultation included. Premium paints only.', services: ['Interior Painting', 'Exterior Painting', 'Cabinet Refinishing', 'Deck Staining', 'Wallpaper'], hours: { open: '8:00 AM', close: '6:00 PM', days: 'Mon-Fri' }, location: { lat: 34.0400, lng: -118.2700, address: '789 Color Ln, Los Angeles, CA 90017' }, distance: 5.5, phone: '(555) 678-9012', favoriteCount: 22, portfolio: [], reviews: [], blog: [], media: [] },
  ]

  // Fetch providers from API, fallback to demo data
  useEffect(() => {
    providersApi.list().then(setProviders).catch(() => setProviders(demoProviders))
  }, [])

  // Fetch favorites from API when user is logged in
  useEffect(() => {
    if (user) {
      usersApi.favorites().then(setFavorites).catch(() => setFavorites([]))
      usersApi.profile().then(p => setRewardsPoints(p.rewardsPoints || 0)).catch(() => {})
    } else {
      setFavorites([])
      setRewardsPoints(0)
    }
  }, [user])

  const toggleFavorite = useCallback(async (providerId) => {
    const isFav = favorites.includes(providerId)
    // Optimistic update
    setFavorites(prev => isFav ? prev.filter(id => id !== providerId) : [...prev, providerId])
    try {
      if (isFav) {
        await usersApi.removeFavorite(providerId)
      } else {
        await usersApi.addFavorite(providerId)
      }
    } catch {
      // Revert on error
      setFavorites(prev => isFav ? [...prev, providerId] : prev.filter(id => id !== providerId))
    }
  }, [favorites])

  const toggleCompare = useCallback((providerId) => {
    setCompareList(prev => {
      if (prev.includes(providerId)) return prev.filter(id => id !== providerId)
      if (prev.length >= 4) return prev
      return [...prev, providerId]
    })
  }, [])

  // Auto-show toast notifications for real-time feel
  useAutoToasts(addToast, providers)

  const toggleAvailability = async (id) => {
    const provider = providers.find(p => p.id === id)
    if (!provider) return

    // Optimistic update
    setProviders(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p))
    addToast({
      type: 'availability',
      title: provider.available ? 'Provider Went Offline' : 'Provider Now Available!',
      message: `${provider.name} is now ${provider.available ? 'unavailable' : 'available for booking'}`,
      duration: 4000
    })

    try {
      await providersApi.toggleAvailability(id)
    } catch {
      // Revert on error
      setProviders(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p))
    }
  }

  const refreshProviders = useCallback(() => {
    providersApi.list().then(setProviders).catch(() => {})
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-brand-600 text-lg font-medium">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rewardsPoints={rewardsPoints} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<Home providers={providers} favorites={favorites} toggleFavorite={toggleFavorite} compareList={compareList} toggleCompare={toggleCompare} />} />
          <Route path="/provider/:id" element={<ProviderPage providers={providers} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/dashboard" element={<ProviderDashboard providers={providers} toggleAvailability={toggleAvailability} />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:providerId" element={<Messages />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/quote" element={<QuoteEngine providers={providers} />} />
          <Route path="/quote/:providerId" element={<QuoteEngine providers={providers} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile providers={providers} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/booking/:providerId" element={<Booking providers={providers} />} />
          <Route path="/checkout/:providerId" element={<Checkout providers={providers} />} />
          <Route path="/map" element={<MapView providers={providers} />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/review" element={<ReviewSubmit />} />
          <Route path="/support" element={<Support />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/blockchain" element={<BlockchainExplorer />} />
          <Route path="/reviews" element={<ReviewHub />} />
          <Route path="/compare" element={<CompareProviders providers={providers} />} />
          <Route path="/emergency" element={<Emergency providers={providers} />} />
          <Route path="/deals" element={<Deals providers={providers} />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/timeline" element={<ServiceTimeline />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/receipt/:paymentId" element={<Receipt />} />
          <Route path="/lead-intake" element={<LeadIntakeForm />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/provider/queue" element={<ProviderAppointmentQueue />} />
          <Route path="/policy-upload" element={<PolicyUpload />} />
          <Route path="/policy-review" element={<PolicyReview />} />
        </Routes>
      </main>

      {/* Floating Compare Bar */}
      {compareList.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-brand-200 px-6 py-4 flex items-center gap-4 animate-slide-in">
          <div className="flex -space-x-2">
            {compareList.map(id => {
              const p = providers.find(pr => pr.id === id)
              return p ? (
                <div key={id} className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center border-2 border-white text-sm">
                  {p.name.charAt(0)}
                </div>
              ) : null
            })}
          </div>
          <span className="text-sm font-medium text-gray-600">{compareList.length} providers selected</span>
          <a href={`/compare?ids=${compareList.join(',')}`}
            className="btn-primary text-sm py-2 px-4">
            Compare Now
          </a>
          <button onClick={() => setCompareList([])}
            className="text-sm text-gray-400 hover:text-gray-600">Clear</button>
        </div>
      )}
    </div>
  )
}
