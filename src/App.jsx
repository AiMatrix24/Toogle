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

  // Fetch providers from API
  useEffect(() => {
    providersApi.list().then(setProviders).catch(err => console.error('Failed to load providers:', err))
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
