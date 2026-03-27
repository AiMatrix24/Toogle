import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
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
import { mockProviders } from './data/mockData'

export default function App() {
  const [providers, setProviders] = useState(mockProviders)
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@email.com', role: 'customer' })

  const toggleAvailability = (id) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p))
  }

  const handleLogin = (userData) => setUser(userData)
  const handleLogout = () => setUser(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<Home providers={providers} />} />
          <Route path="/provider/:id" element={<ProviderPage providers={providers} />} />
          <Route path="/dashboard" element={<ProviderDashboard providers={providers} toggleAvailability={toggleAvailability} />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:providerId" element={<Messages />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/quote" element={<QuoteEngine providers={providers} />} />
          <Route path="/quote/:providerId" element={<QuoteEngine providers={providers} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
          <Route path="/booking/:providerId" element={<Booking providers={providers} />} />
          <Route path="/checkout/:providerId" element={<Checkout providers={providers} />} />
          <Route path="/map" element={<MapView providers={providers} />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/review" element={<ReviewSubmit />} />
          <Route path="/support" element={<Support />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  )
}
