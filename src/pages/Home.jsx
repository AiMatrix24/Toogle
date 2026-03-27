import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Search, Star, Clock, DollarSign, Zap, Filter, ChevronDown } from 'lucide-react'
import { serviceCategories } from '../data/mockData'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
      ))}
      <span className="text-sm font-medium text-gray-600 ml-1">{rating}</span>
    </div>
  )
}

function ProviderCard({ provider }) {
  return (
    <Link to={`/provider/${provider.id}`} className="card group">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
              provider.available ? 'bg-brand-600' : 'bg-gray-400'
            }`}>
              {provider.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{provider.name}</h3>
              <p className="text-sm text-gray-500">{provider.category}</p>
            </div>
          </div>
          {provider.available ? (
            <span className="badge-available">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Available Now
            </span>
          ) : (
            <span className="badge-unavailable">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Unavailable
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{provider.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {provider.services.slice(0, 3).map(s => (
            <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{s}</span>
          ))}
          {provider.services.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">+{provider.services.length - 3} more</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <StarRating rating={provider.rating} />
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Clock size={14} />{provider.responseTime}</span>
            <span className="flex items-center gap-1"><DollarSign size={14} />${provider.hourlyRate}/hr</span>
            <span className="flex items-center gap-1"><MapPin size={14} />{provider.distance} mi</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home({ providers }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [sortBy, setSortBy] = useState('distance')
  const [userLocation, setUserLocation] = useState(null)
  const [serviceNeeded, setServiceNeeded] = useState('')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 34.0522, lng: -118.2437 })
      )
    }
  }, [])

  const filtered = providers
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.services.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || p.category === category
      const matchesAvailable = !availableOnly || p.available
      return matchesSearch && matchesCategory && matchesAvailable
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price') return a.hourlyRate - b.hourlyRate
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount
      return 0
    })

  const recommended = [...providers]
    .filter(p => p.available)
    .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
    .slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark mb-3">
          Find Available Services <span className="text-brand-600">Right Now</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Real-time availability. Instant booking. Trusted providers near you.
        </p>
        {userLocation && (
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-brand-600">
            <MapPin size={16} />
            <span>Using your location to find nearby services</span>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative md:col-span-2">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services, providers, or categories..."
              className="input-field pl-12" />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="input-field pl-10 appearance-none cursor-pointer">
              <option value="All">All Categories</option>
              {serviceCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setAvailableOnly(!availableOnly)}
              className={`toggle-track ${availableOnly ? 'bg-accent-500' : 'bg-gray-300'}`}>
              <div className={`toggle-thumb ${availableOnly ? 'translate-x-7' : ''}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">Available Now Only</span>
          </label>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">Sort by:</span>
            {['distance', 'rating', 'price', 'reviews'].map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  sortBy === s ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Service Needed Input */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Describe the service you need:</label>
          <div className="flex gap-3">
            <input type="text" value={serviceNeeded} onChange={(e) => setServiceNeeded(e.target.value)}
              placeholder="e.g., My kitchen faucet is leaking and needs repair..."
              className="input-field flex-1" />
            <Link to={`/quote${serviceNeeded ? `?service=${encodeURIComponent(serviceNeeded)}` : ''}`}
              className="btn-primary whitespace-nowrap flex items-center gap-2">
              <Zap size={16} />
              Get Quotes
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star size={20} className="text-yellow-500" />
            Recommended For You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommended.map(p => (
              <Link key={p.id} to={`/provider/${p.id}`}
                className="card p-4 border-2 border-yellow-100 bg-yellow-50/30 hover:border-yellow-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.category} &middot; {p.distance} mi away</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <StarRating rating={p.rating} />
                  <span className="text-xs text-gray-500">{p.reviewCount} reviews</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {filtered.length} Service{filtered.length !== 1 ? 's' : ''} Found
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(p => <ProviderCard key={p.id} provider={p} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No services found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
