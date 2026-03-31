import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Phone, MessageCircle, Clock, MapPin, DollarSign, Shield, CheckCircle, Zap, X } from 'lucide-react'

const emergencyCategories = ['All', 'Plumbing', 'Electrical', 'HVAC', 'Locksmith']

function parseResponseMinutes(responseTime) {
  if (responseTime.includes('15')) return 15
  if (responseTime.includes('20')) return 20
  if (responseTime.includes('30')) return 30
  if (responseTime.includes('45')) return 45
  if (responseTime.includes('1 hr') || responseTime.includes('1hr')) return 60
  if (responseTime.includes('2')) return 120
  return 180
}

export default function Emergency({ providers }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sosBroadcast, setSosBroadcast] = useState(false)

  const filteredProviders = useMemo(() => {
    let list = (providers || []).filter(p => p.available)
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category === selectedCategory)
    }
    return list.sort((a, b) => parseResponseMinutes(a.responseTime) - parseResponseMinutes(b.responseTime))
  }, [providers, selectedCategory])

  const handleSOS = () => {
    setSosBroadcast(true)
    setTimeout(() => setSosBroadcast(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pulsing Emergency Header */}
      <div className="bg-red-600 animate-pulse">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <AlertTriangle size={28} className="text-yellow-300" />
            <div>
              <h1 className="text-xl font-bold tracking-wide">EMERGENCY MODE</h1>
              <p className="text-red-200 text-sm">Find urgent help now</p>
            </div>
          </div>
          <button
            onClick={handleSOS}
            className="flex items-center gap-2 bg-white text-red-600 font-bold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors shadow-lg"
          >
            <Zap size={18} />
            SOS Broadcast
          </button>
        </div>
      </div>

      {/* SOS Toast */}
      {sosBroadcast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle size={22} />
          <div>
            <p className="font-semibold">SOS Broadcast Sent!</p>
            <p className="text-green-100 text-sm">Nearby providers have been notified</p>
          </div>
          <button onClick={() => setSosBroadcast(false)} className="ml-2 text-green-200 hover:text-white">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {emergencyCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        {filteredProviders.length === 0 ? (
          <div className="card p-10 text-center">
            <AlertTriangle size={48} className="mx-auto text-orange-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Providers Available Right Now</h2>
            <p className="text-gray-500 mb-4">
              No available providers found{selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}. Try selecting a different category or check back shortly.
            </p>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-red-600 font-medium hover:underline"
              >
                Show all categories
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProviders.map(provider => {
              const estimatedArrival = Math.round((provider.distance / 30) * 60)
              const emergencyRate = Math.round(provider.hourlyRate * 1.5)

              return (
                <div key={provider.id} className="card overflow-hidden border-l-4 border-l-orange-500">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      {/* Left: Provider Info */}
                      <div className="flex items-start gap-4">
                        {/* Availability Indicator */}
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold text-xl">
                            {provider.name.charAt(0)}
                          </div>
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                        </div>
                        <div>
                          <Link to={`/provider/${provider.id}`} className="font-semibold text-gray-900 hover:text-brand-600 transition-colors">
                            {provider.name}
                          </Link>
                          <p className="text-sm text-gray-500">{provider.category}</p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {/* Response Time (prominent) */}
                            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                              <Clock size={14} />
                              {provider.responseTime}
                            </span>
                            {/* Estimated Arrival */}
                            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                              <MapPin size={14} className="text-red-500" />
                              {provider.distance} mi
                              <span className="text-gray-400">·</span>
                              ~{estimatedArrival} min arrival
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Rate and Actions */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">${emergencyRate}/hr</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                            <Zap size={10} />
                            1.5x Emergency Rate
                          </span>
                          <p className="text-xs text-gray-400 mt-0.5">Standard: ${provider.hourlyRate}/hr</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                      <a
                        href={`tel:${provider.phone.replace(/[^0-9]/g, '')}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors text-lg shadow-md"
                      >
                        <Phone size={20} />
                        Call Now
                      </a>
                      <Link
                        to={`/messages/${provider.id}`}
                        className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium px-5 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <MessageCircle size={18} />
                        Message
                      </Link>
                      <Link
                        to={`/booking/${provider.id}`}
                        className="flex items-center justify-center gap-2 bg-brand-600 text-white font-medium px-5 py-3 rounded-xl hover:bg-brand-700 transition-colors"
                      >
                        <Shield size={18} />
                        Book
                      </Link>
                    </div>

                    {/* Phone number displayed */}
                    <p className="text-center text-sm text-gray-500 mt-2">{provider.phone}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
