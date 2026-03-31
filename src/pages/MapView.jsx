import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { MapPin, Star, Clock, DollarSign, Navigation, List, Map, Filter } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

export default function MapView({ providers }) {
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [viewMode, setViewMode] = useState('map')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  const userLocation = [34.0522, -118.2437]
  const displayed = showAvailableOnly ? providers.filter(p => p.available) : providers
  const available = providers.filter(p => p.available)

  // Initialize map
  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return

    const map = L.map(mapRef.current, {
      center: userLocation,
      zoom: 13,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    // User location marker
    const userIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="position:relative">
        <div style="width:20px;height:20px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>
        <div style="position:absolute;inset:-6px;border-radius:50%;background:rgba(59,130,246,0.25);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite"></div>
      </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
    L.marker(userLocation, { icon: userIcon }).addTo(map).bindPopup('<b>Your Location</b>')
    L.circle(userLocation, { radius: 800, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.05, weight: 1 }).addTo(map)

    mapInstanceRef.current = map

    // Force resize after render
    setTimeout(() => map.invalidateSize(), 100)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers when providers/filter changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []

    displayed.forEach(p => {
      const color = p.available ? '#1647b6' : '#9ca3af'
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="position:relative">
          <div style="width:38px;height:38px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px">${p.name.charAt(0)}</div>
          ${p.available ? `<div style="position:absolute;top:-2px;right:-2px;width:12px;height:12px;background:#22c55e;border-radius:50%;border:2px solid white"></div>` : ''}
        </div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
      })

      const marker = L.marker([p.location.lat, p.location.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:200px;font-family:system-ui">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <b style="font-size:14px">${p.name}</b>
              ${p.available ? '<span style="background:#22c55e;color:white;padding:2px 8px;border-radius:12px;font-size:11px">Available</span>' : ''}
            </div>
            <div style="font-size:12px;color:#666;margin-bottom:4px">${p.category} &bull; ${p.distance} mi away</div>
            <div style="font-size:12px;margin-bottom:8px">&#9733; ${p.rating} (${p.reviewCount} reviews) &bull; $${p.hourlyRate}/hr</div>
            <div style="display:flex;gap:8px">
              <a href="/provider/${p.id}" style="color:#1647b6;font-weight:600;font-size:12px;text-decoration:none">View Profile</a>
              <a href="/booking/${p.id}" style="color:#16a34a;font-weight:600;font-size:12px;text-decoration:none">Book Now</a>
            </div>
          </div>
        `)
        .on('click', () => setSelectedProvider(p))

      markersRef.current.push(marker)
    })
  }, [displayed])

  // Fly to selected provider
  useEffect(() => {
    if (selectedProvider && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedProvider.location.lat, selectedProvider.location.lng],
        14,
        { duration: 1 }
      )
    }
  }, [selectedProvider])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nearby Services</h1>
          <p className="text-gray-500">{available.length} available providers near you</p>
        </div>
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-2 mr-4 cursor-pointer">
            <input type="checkbox" checked={showAvailableOnly} onChange={() => setShowAvailableOnly(!showAvailableOnly)}
              className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            <span className="text-sm text-gray-600">Available only</span>
          </label>
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
            {viewMode === 'map' ? (
              <div ref={mapRef} className="h-[540px]" style={{ borderRadius: '1rem' }} />
            ) : (
              <div className="p-4 space-y-3 max-h-[540px] overflow-y-auto">
                {[...displayed].sort((a, b) => a.distance - b.distance).map(p => (
                  <Link key={p.id} to={`/provider/${p.id}`} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-gray-100">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${p.available ? 'bg-brand-600' : 'bg-gray-400'}`}>
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.category} &middot; {p.distance} mi &middot; ${p.hourlyRate}/hr</p>
                    </div>
                    {p.available ? (
                      <span className="badge-available text-xs"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Available</span>
                    ) : (
                      <span className="badge-unavailable text-xs">Unavailable</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Provider List Sidebar */}
        <div className="space-y-3 max-h-[580px] overflow-y-auto">
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
              {selectedProvider.available && (
                <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-green-700 font-medium">Available Now</span>
                  <span className="text-xs text-green-600 ml-auto">Response: {selectedProvider.responseTime}</span>
                </div>
              )}
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

          {[...displayed].sort((a, b) => a.distance - b.distance).map(p => (
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
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 animate-pulse" />
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
