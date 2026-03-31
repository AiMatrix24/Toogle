import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Search, Star, Clock, DollarSign, Zap, Filter, ChevronDown, Shield, BadgeCheck, Heart, GitCompare, AlertTriangle, Tag, ArrowRight } from 'lucide-react'
import { serviceCategories } from '../data/constants'
import { deals as dealsApi, search as searchApi } from '../lib/api'

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

function TrustScore({ provider }) {
  const score = Math.round(
    (provider.rating / 5) * 35 +
    Math.min(provider.reviewCount / 300, 1) * 25 +
    (provider.available ? 15 : 5) +
    (provider.responseTime.includes('15') ? 15 : provider.responseTime.includes('20') ? 13 : provider.responseTime.includes('30') ? 10 : 5) +
    10
  )
  const color = score >= 90 ? 'text-green-600' : score >= 75 ? 'text-blue-600' : 'text-yellow-600'
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold ${color}`}>
      <Shield size={10} />{score}
    </span>
  )
}

function ProviderCard({ provider, isFavorite, onToggleFavorite, isCompare, onToggleCompare }) {
  return (
    <div className="card group relative">
      {/* Favorite & Compare buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        <button onClick={(e) => { e.preventDefault(); onToggleCompare?.(provider.id) }}
          className={`p-1.5 rounded-lg transition-all ${isCompare ? 'bg-brand-100 text-brand-600' : 'bg-white/80 text-gray-400 hover:text-brand-500'}`}
          title="Add to compare">
          <GitCompare size={14} />
        </button>
        <button onClick={(e) => { e.preventDefault(); onToggleFavorite?.(provider.id) }}
          className={`p-1.5 rounded-lg transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-400'}`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <Heart size={14} className={isFavorite ? 'fill-red-500' : ''} />
        </button>
      </div>

      <Link to={`/provider/${provider.id}`}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3 pr-16">
            <div className="flex items-center gap-3">
              <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                provider.available ? 'bg-brand-600' : 'bg-gray-400'
              }`}>
                {provider.name.charAt(0)}
                {provider.available && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-live-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{provider.name}</h3>
                  {provider.rating >= 4.7 && <BadgeCheck size={14} className="text-blue-500" />}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">{provider.category}</p>
                  <TrustScore provider={provider} />
                </div>
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
    </div>
  )
}

export default function Home({ providers, favorites = [], toggleFavorite, compareList = [], toggleCompare }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [sortBy, setSortBy] = useState('distance')
  const [userLocation, setUserLocation] = useState(null)
  const [serviceNeeded, setServiceNeeded] = useState('')
  const [topDeals, setTopDeals] = useState([])
  const [suggestions, setSuggestions] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    dealsApi.list(4).then(d => setTopDeals(d)).catch(() => {})
  }, [])

  useEffect(() => {
    setUserLocation({ lat: 34.0522, lng: -118.2437 })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
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

  // topDeals loaded via useEffect above

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Emergency Banner */}
      <Link to="/emergency"
        className="flex items-center justify-center gap-3 mb-6 p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl text-white hover:from-red-600 hover:to-orange-600 transition-all group">
        <AlertTriangle size={20} className="animate-pulse" />
        <span className="font-bold">Emergency? Get Help NOW</span>
        <span className="text-white/80 text-sm">Available providers ready to respond immediately</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>

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
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input type="text" value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                const q = e.target.value
                if (q.length >= 2) {
                  searchApi.autocomplete(q).then(data => {
                    setSuggestions(data)
                    setShowSuggestions(true)
                  }).catch(() => {})
                } else {
                  setShowSuggestions(false)
                }
              }}
              onFocus={() => search.length >= 2 && suggestions && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search services, providers, or categories..."
              className="input-field pl-12" />
            {showSuggestions && suggestions && (suggestions.providers?.length > 0 || suggestions.services?.length > 0 || suggestions.categories?.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                {suggestions.providers?.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-400 px-2 mb-1">Providers</p>
                    {suggestions.providers.map(p => (
                      <a key={p.id} href={`/provider/${p.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-brand-50 cursor-pointer">
                        <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold">{p.name.charAt(0)}</div>
                        <div><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-gray-400">{p.category}</p></div>
                      </a>
                    ))}
                  </div>
                )}
                {suggestions.services?.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-400 px-2 mb-1">Services</p>
                    {suggestions.services.map(s => (
                      <button key={s} onClick={() => { setSearch(s); setShowSuggestions(false) }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-brand-50">{s}</button>
                    ))}
                  </div>
                )}
                {suggestions.categories?.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-400 px-2 mb-1">Categories</p>
                    {suggestions.categories.map(c => (
                      <button key={c} onClick={() => { setCategory(c); setSearch(''); setShowSuggestions(false) }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-brand-50">{c}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
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

        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Describe the service you need:</label>
          <div className="flex gap-3">
            <input type="text" value={serviceNeeded} onChange={(e) => setServiceNeeded(e.target.value)}
              placeholder="e.g., My kitchen faucet is leaking and needs repair..."
              className="input-field flex-1" />
            <Link to={`/quote${serviceNeeded ? `?service=${encodeURIComponent(serviceNeeded)}` : ''}`}
              className="btn-primary whitespace-nowrap flex items-center gap-2">
              <Zap size={16} /> Get Quotes
            </Link>
          </div>
        </div>
      </div>

      {/* Today's Deals */}
      {topDeals.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Tag size={20} className="text-accent-500" />
              Today's Deals
            </h2>
            <Link to="/deals" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
              View All Deals <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {topDeals.map(deal => {
              const provider = providers.find(p => p.id === deal.providerId)
              const provName = provider?.name || deal.providerName || 'Provider'
              return (
                <Link key={deal.id} to="/deals"
                  className="card p-4 min-w-[280px] shrink-0 border-2 border-green-100 bg-green-50/20 hover:border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
                      {provName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{deal.title}</p>
                      <p className="text-xs text-gray-500">{provName}</p>
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{deal.percentOff}% OFF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 line-through">${deal.originalPrice}</span>
                    <span className="text-lg font-bold text-green-600">${deal.dealPrice}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

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
        {filtered.map(p => (
          <ProviderCard key={p.id} provider={p}
            isFavorite={favorites.includes(p.id)}
            onToggleFavorite={toggleFavorite}
            isCompare={compareList.includes(p.id)}
            onToggleCompare={toggleCompare} />
        ))}
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
