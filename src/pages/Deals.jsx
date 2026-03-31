import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Tag, Clock, Star, Zap, Percent, Gift, Timer, ShoppingBag } from 'lucide-react'
import { deals as dealsApi } from '../lib/api'

function getTimeRemaining(ms) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

function CountdownTimer({ expiresIn, small = false }) {
  const [remaining, setRemaining] = useState(expiresIn)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => Math.max(0, prev - 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const time = getTimeRemaining(remaining)
  const isUrgent = remaining < 3600000

  const timerClass = small
    ? `text-xs font-mono ${isUrgent ? 'text-red-600' : 'text-gray-600'}`
    : `text-lg font-mono font-bold ${isUrgent ? 'text-red-600' : 'text-gray-800'}`

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className={`flex items-center gap-1 ${timerClass}`}>
      <Timer size={small ? 12 : 16} />
      <span>{time.days > 0 ? `${time.days}d ` : ''}{pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}</span>
    </div>
  )
}

export default function Deals({ providers }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [claimedDeals, setClaimedDeals] = useState({})
  const [allDeals, setAllDeals] = useState([])

  useEffect(() => {
    dealsApi.list().then(data => {
      // Add expiresIn from expiresAt for countdown compatibility
      const withExpiry = data.map(d => ({
        ...d,
        expiresIn: d.expiresAt ? new Date(d.expiresAt).getTime() - Date.now() : 86400000 * 7,
      }))
      setAllDeals(withExpiry)
    }).catch(() => {})
  }, [])

  const categories = useMemo(() => {
    const cats = [...new Set(allDeals.map(d => d.category))]
    return ['All', ...cats]
  }, [allDeals])

  const filteredDeals = useMemo(() =>
    selectedCategory === 'All'
      ? allDeals
      : allDeals.filter(d => d.category === selectedCategory),
    [selectedCategory, allDeals]
  )

  const endingSoonDeals = useMemo(() =>
    allDeals.filter(d => d.expiresIn < 86400000),
    [allDeals]
  )

  const getProvider = (providerId) =>
    providers?.find(p => p.id === providerId) || { name: allDeals.find(d => d.providerId === providerId)?.providerName || 'Unknown Provider' }

  const handleClaim = (dealId) => {
    dealsApi.claim(dealId).catch(() => {})
    setClaimedDeals(prev => ({ ...prev, [dealId]: true }))
  }

  const featuredDeal = allDeals[0]
  const featuredProvider = featuredDeal ? getProvider(featuredDeal.providerId) : { name: 'Loading...' }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag size={28} />
          <h1 className="text-2xl font-bold">Deals & Promotions</h1>
        </div>
        <p className="text-purple-100 text-sm">Exclusive savings from top-rated providers</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Featured Deal */}
        {featuredDeal && <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Featured Deal</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
              {featuredProvider.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{featuredProvider.name}</p>
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">{featuredDeal.category}</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">{featuredDeal.title}</h2>
          <p className="text-gray-600 text-sm mb-4">{featuredDeal.description}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-400 line-through text-lg">${featuredDeal.originalPrice}</span>
            <span className="text-3xl font-bold text-green-600">
              {featuredDeal.dealPrice === 0 ? 'FREE' : `$${featuredDeal.dealPrice}`}
            </span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{featuredDeal.percentOff}% OFF</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <CountdownTimer expiresIn={featuredDeal.expiresIn} />
            <span className="text-sm text-gray-500">
              {featuredDeal.maxClaims - featuredDeal.claimedCount} spots left
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-amber-500 h-2.5 rounded-full transition-all"
              style={{ width: `${(featuredDeal.claimedCount / featuredDeal.maxClaims) * 100}%` }}
            />
          </div>

          <button
            onClick={() => handleClaim(featuredDeal.id)}
            disabled={claimedDeals[featuredDeal.id]}
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
              claimedDeals[featuredDeal.id]
                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg'
            }`}
          >
            {claimedDeals[featuredDeal.id] ? 'Deal Claimed!' : 'Claim Deal'}
          </button>
        </div>}

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
              }`}
            >
              {cat === 'All' && <Tag size={14} className="inline mr-1 -mt-0.5" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Ending Soon Section */}
        {endingSoonDeals.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-red-600" />
              <h2 className="text-lg font-bold text-red-700">Ending Soon</h2>
            </div>
            <div className="space-y-3">
              {endingSoonDeals.map(deal => {
                const provider = getProvider(deal.providerId)
                return (
                  <div key={`urgent-${deal.id}`} className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs">
                          {provider.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{deal.title}</p>
                          <p className="text-xs text-gray-500">{provider.name}</p>
                        </div>
                      </div>
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{deal.percentOff}% OFF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 line-through text-sm">${deal.originalPrice}</span>
                        <span className="text-lg font-bold text-green-600">
                          {deal.dealPrice === 0 ? 'FREE' : `$${deal.dealPrice}`}
                        </span>
                      </div>
                      <CountdownTimer expiresIn={deal.expiresIn} small />
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => handleClaim(deal.id)}
                        disabled={claimedDeals[deal.id]}
                        className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${
                          claimedDeals[deal.id]
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {claimedDeals[deal.id] ? 'Deal Claimed!' : 'Claim Now'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Deal Cards Grid */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Percent size={18} className="text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">All Deals</h2>
            <span className="text-sm text-gray-500">({filteredDeals.length})</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredDeals.map(deal => {
              const provider = getProvider(deal.providerId)
              const spotsLeft = deal.maxClaims - deal.claimedCount
              const claimProgress = (deal.claimedCount / deal.maxClaims) * 100

              return (
                <div key={deal.id} className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm flex flex-col">
                  {/* Provider */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs">
                      {provider.name.charAt(0)}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{provider.name}</p>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">{deal.title}</h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{deal.description}</p>

                  {/* Pricing */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-gray-400 line-through text-xs">${deal.originalPrice}</span>
                    <span className="text-base font-bold text-green-600">
                      {deal.dealPrice === 0 ? 'FREE' : `$${deal.dealPrice}`}
                    </span>
                  </div>
                  <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 w-fit">
                    {deal.percentOff}% OFF
                  </span>

                  {/* Countdown */}
                  <div className="mb-2">
                    <CountdownTimer expiresIn={deal.expiresIn} small />
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${claimProgress > 80 ? 'bg-red-500' : 'bg-purple-500'}`}
                        style={{ width: `${claimProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{spotsLeft} spots left</p>
                  </div>

                  {/* Category Tag */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      <Tag size={10} />
                      {deal.category}
                    </span>
                  </div>

                  {/* Claim Button */}
                  <button
                    onClick={() => handleClaim(deal.id)}
                    disabled={claimedDeals[deal.id]}
                    className={`mt-auto w-full py-2 rounded-lg text-sm font-bold transition-all ${
                      claimedDeals[deal.id]
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {claimedDeals[deal.id] ? 'Claimed!' : 'Claim Deal'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
