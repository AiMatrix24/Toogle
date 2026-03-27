import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProviderPage from './pages/ProviderPage'
import ProviderDashboard from './pages/ProviderDashboard'
import Messages from './pages/Messages'
import Contracts from './pages/Contracts'
import QuoteEngine from './pages/QuoteEngine'
import { mockProviders } from './data/mockData'

export default function App() {
  const [providers, setProviders] = useState(mockProviders)

  const toggleAvailability = (id) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
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
        </Routes>
      </main>
    </div>
  )
}
