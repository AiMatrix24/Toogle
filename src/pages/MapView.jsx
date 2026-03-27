import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Clock, DollarSign, Navigation, List, Map } from 'lucide-react'

export default function MapView({ providers }) {
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [viewMode, setViewMode] = useState('map')

  const available = providers.filter(p => p.available)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nearby Services</h1>
          <p className="text-gray-500">{available.length} available providers near you</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
              viewMode === 'map' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
            <Map size={16} /> Map
          </button>
          <button onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
              viewMode === 'list' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
            <List size={16} /> List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="relative bg-gradient-to-br from-blue-50 to-green-50 h-[500px]">
              {/* Simulated Map */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="absolute border border-gray-300"
                    style={{
                      left: `${10 + (i % 5) * 20}%`, top: `${10 + Math.floor(i / 5) * 25}%`,
                      width: '18%', height: '22%'
                    }} />
                ))}
              </div>

              {/* Provider Pins */}
              {providers.map((p, i) => {
                const positions = [
                  { left: '25%', top: '30%' }, { left: '55%', top: '20%' },
                  { left: '40%', top: '55%' }, { left: '15%', top: '60%' },
                  { left: '70%', top: '45%' }, { left: '60%', top: '70%' }
                ]
                const pos = positions[i] || { left: '50%', top: '50%' }
                return (
                  <button key={p.id} onClick={() => setSelectedProvider(p)}
                    className={`absolute transform -translate-x-1/2 -translate-y-full transition-all z-10 ${
                      selectedProvider?.id === p.id ? 'scale-125 z-20' : 'hover:scale-110'
                    }`}
                    style={pos}>
                    <div className={`relative ${p.available ? '' : 'opacity-50'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white ${
                        p.available ? 'bg-brand-600' : 'bg-gray-400'
                      }`}>
                        {p.name.charAt(0)}
                      </div>
                      {p.available && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                      )}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
                        <span className="text-xs font-semibold bg-white px-2 py-0.5 rounded shadow text-gray-800">{p.distance} mi</span>
                      </div>
                    </div>
                  </button>
                )
              })}

              {/* User Location */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                  <Navigation size={12} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-blue-400/30 rounded-full animate-ping" />
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded">You</span>
              </div>
            </div>
          </div>
        </div>

        {/* Provider List */}
        <div className="space-y-3 max-h-[540px] overflow-y-auto">
          {selectedProvider ? (
            <div className="card p-5 border-2 border-brand-200">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                  selectedProvider.available ? 'bg-brand-600' : 'bg-gray-400'
                }`}>
                  {selectedProvider.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedProvider.name}</h3>
                  <p className="text-sm text-gray-500">{selectedProvider.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{selectedProvider.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500" />{selectedProvider.rating}</span>
                <span className="flex items-center gap-1"><Clock size={14} />{selectedProvider.responseTime}</span>
                <span className="flex items-center gap-1"><DollarSign size={14} />${selectedProvider.hourlyRate}/hr</span>
                <span className="flex items-center gap-1"><MapPin size={14} />{selectedProvider.distance} mi</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/provider/${selectedProvider.id}`} className="btn-primary flex-1 text-center text-sm py-2.5">View Profile</Link>
                <Link to={`/booking/${selectedProvider.id}`} className="btn-accent flex-1 text-center text-sm py-2.5">Book Now</Link>
              </div>
              <button onClick={() => setSelectedProvider(null)}
                className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600">Clear selection</button>
            </div>
          ) : (
            <div className="p-4 bg-brand-50 rounded-xl text-center text-sm text-brand-700">
              <MapPin size={20} className="mx-auto mb-1" />
              Click a pin on the map to view provider details
            </div>
          )}

          {providers.sort((a, b) => a.distance - b.distance).map(p => (
            <button key={p.id} onClick={() => setSelectedProvider(p)}
              className={`card p-4 w-full text-left transition-all ${
                selectedProvider?.id === p.id ? 'ring-2 ring-brand-500' : ''
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                  p.available ? 'bg-brand-600' : 'bg-gray-400'
                }`}>
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{p.category}</span>
                    <span>&middot;</span>
                    <span>{p.distance} mi</span>
                    <span>&middot;</span>
                    <span>${p.hourlyRate}/hr</span>
                  </div>
                </div>
                {p.available ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
