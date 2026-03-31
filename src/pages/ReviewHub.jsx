import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, TrendingUp, ThumbsUp, ThumbsDown, BarChart3, Award, Shield, Search, Filter } from 'lucide-react'
import { providers as providersApi } from '../lib/api'

function TrustScore({ score }) {
  const color = score >= 90 ? 'text-green-600 bg-green-50 border-green-200' :
                score >= 75 ? 'text-blue-600 bg-blue-50 border-blue-200' :
                score >= 60 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                'text-red-600 bg-red-50 border-red-200'
  const label = score >= 90 ? 'Excellent' : score >= 75 ? 'Very Good' : score >= 60 ? 'Good' : 'Fair'

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${color}`}>
      <Shield size={14} />
      <span className="font-bold text-sm">{score}</span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}

function SentimentBar({ positive, neutral, negative }) {
  const total = positive + neutral + negative
  return (
    <div className="flex rounded-full overflow-hidden h-2.5">
      <div className="bg-green-400" style={{ width: `${(positive / total) * 100}%` }} />
      <div className="bg-yellow-400" style={{ width: `${(neutral / total) * 100}%` }} />
      <div className="bg-red-400" style={{ width: `${(negative / total) * 100}%` }} />
    </div>
  )
}

function calculateTrustScore(provider) {
  const ratingScore = (provider.rating / 5) * 35
  const volumeScore = Math.min(provider.reviewCount / 300, 1) * 25
  const availScore = provider.available ? 15 : 5
  const responseScore = provider.responseTime.includes('15') ? 15 :
                        provider.responseTime.includes('20') ? 13 :
                        provider.responseTime.includes('30') ? 10 :
                        provider.responseTime.includes('45') ? 7 : 5
  const verifiedScore = 10
  return Math.round(ratingScore + volumeScore + availScore + responseScore + verifiedScore)
}

function getSentiment(provider) {
  const total = provider.reviewCount
  const positive = Math.round(total * (provider.rating / 5) * 0.9)
  const negative = Math.round(total * ((5 - provider.rating) / 5) * 0.5)
  const neutral = total - positive - negative
  return { positive: Math.max(positive, 1), neutral: Math.max(neutral, 1), negative: Math.max(negative, 0) }
}

export default function ReviewHub() {
  const [sortBy, setSortBy] = useState('trust')
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [allProviders, setAllProviders] = useState([])

  useEffect(() => {
    providersApi.list().then(setAllProviders).catch(() => {})
  }, [])

  const providersWithScores = useMemo(() =>
    allProviders.map(p => ({
      ...p,
      trustScore: calculateTrustScore(p),
      sentiment: getSentiment(p),
    })),
    [allProviders]
  )

  const filtered = providersWithScores
    .filter(p => {
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'trust') return b.trustScore - a.trustScore
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount
      return 0
    })

  const avgRating = (providersWithScores.reduce((acc, p) => acc + p.rating, 0) / providersWithScores.length).toFixed(1)
  const totalReviews = providersWithScores.reduce((acc, p) => acc + p.reviewCount, 0)
  const avgTrust = Math.round(providersWithScores.reduce((acc, p) => acc + p.trustScore, 0) / providersWithScores.length)

  const categories = ['All', ...new Set(allProviders.map(p => p.category))]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Award size={24} className="text-yellow-500" /> Review & Trust Hub
        </h1>
        <p className="text-gray-500">Compare providers by reviews, trust scores, and sentiment analysis</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-brand-600">{totalReviews.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Reviews</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-yellow-600">{avgRating}</p>
          <p className="text-sm text-gray-500 mt-1">Average Rating</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{avgTrust}</p>
          <p className="text-sm text-gray-500 mt-1">Avg Trust Score</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-purple-600">{allProviders.filter(p => p.available).length}/{allProviders.length}</p>
          <p className="text-sm text-gray-500 mt-1">Available Now</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search providers..." className="input-field pl-10 py-2 text-sm" />
          </div>
          <div className="flex gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setFilterCategory(c)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                  filterCategory === c ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Sort:</span>
            {[['trust', 'Trust Score'], ['rating', 'Rating'], ['reviews', 'Reviews']].map(([key, label]) => (
              <button key={key} onClick={() => setSortBy(key)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                  sortBy === key ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Provider Review Cards */}
      <div className="space-y-4">
        {filtered.map((p, rank) => (
          <div key={p.id} className="card p-6">
            <div className="flex items-start gap-4">
              <div className="text-center shrink-0">
                <div className="text-2xl font-bold text-gray-300 mb-2">#{rank + 1}</div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl ${
                  p.available ? 'bg-brand-600' : 'bg-gray-400'
                }`}>
                  {p.name.charAt(0)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <Link to={`/provider/${p.id}`} className="font-bold text-lg text-gray-900 hover:text-brand-600">{p.name}</Link>
                  <span className="text-sm text-gray-500">{p.category}</span>
                  <TrustScore score={p.trustScore} />
                  {p.available && (
                    <span className="badge-available text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Available
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  {/* Rating Breakdown */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-yellow-500" />
                      <span className="font-bold text-lg">{p.rating}</span>
                      <span className="text-sm text-gray-400">/ 5.0</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} className={i <= Math.round(p.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{p.reviewCount} total reviews</p>
                  </div>

                  {/* Sentiment Analysis */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2 font-medium">SENTIMENT ANALYSIS</p>
                    <SentimentBar {...p.sentiment} />
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="flex items-center gap-1 text-green-600">
                        <ThumbsUp size={10} /> {p.sentiment.positive}
                      </span>
                      <span className="text-yellow-600">{p.sentiment.neutral} neutral</span>
                      <span className="flex items-center gap-1 text-red-600">
                        <ThumbsDown size={10} /> {p.sentiment.negative}
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Response Time</span>
                      <span className="font-medium">{p.responseTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Hourly Rate</span>
                      <span className="font-medium">${p.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Distance</span>
                      <span className="font-medium">{p.distance} mi</span>
                    </div>
                  </div>
                </div>

                {/* Latest Review */}
                {p.reviews.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">Latest Review</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} size={10} className={i <= p.reviews[0].rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 ml-auto">{p.reviews[0].user} &middot; {p.reviews[0].date}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{p.reviews[0].text}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
