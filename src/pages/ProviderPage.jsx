import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Clock, DollarSign, Phone, MessageSquare, Calculator, Play, Mic, Pause, FileText, ChevronRight, Shield, BadgeCheck, Award, Eye, Heart } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import BeforeAfterGallery from '../components/BeforeAfterGallery'

function TrustBadge({ score }) {
  const color = score >= 90 ? 'from-green-500 to-emerald-600' :
                score >= 75 ? 'from-blue-500 to-indigo-600' :
                'from-yellow-500 to-orange-600'
  const label = score >= 90 ? 'Excellent' : score >= 75 ? 'Very Good' : 'Good'
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${color} text-white`}>
      <Shield size={16} />
      <span className="font-bold">{score}</span>
      <span className="text-sm font-medium text-white/80">{label}</span>
    </div>
  )
}

function VerificationBadges({ provider }) {
  const badges = [
    { label: 'Licensed', icon: BadgeCheck, verified: true },
    { label: 'Insured', icon: Shield, verified: true },
    { label: 'Background Check', icon: Eye, verified: provider.rating >= 4.7 },
    { label: 'Top Rated', icon: Award, verified: provider.rating >= 4.8 },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(b => (
        <span key={b.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
          b.verified ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-400 border border-gray-200'
        }`}>
          <b.icon size={12} />
          {b.label}
          {b.verified && <BadgeCheck size={10} className="text-green-500" />}
        </span>
      ))}
    </div>
  )
}

function calculateTrustScore(provider) {
  const ratingScore = (provider.rating / 5) * 35
  const volumeScore = Math.min(provider.reviewCount / 300, 1) * 25
  const availScore = provider.available ? 15 : 5
  const responseScore = provider.responseTime.includes('15') ? 15 :
                        provider.responseTime.includes('20') ? 13 :
                        provider.responseTime.includes('30') ? 10 : 5
  const verifiedScore = 10
  return Math.round(ratingScore + volumeScore + availScore + responseScore + verifiedScore)
}

function MediaPlayer({ media }) {
  const [playing, setPlaying] = useState(null)

  const typeConfig = {
    video: { bg: 'bg-red-100', color: 'text-red-600', icon: Play },
    podcast: { bg: 'bg-purple-100', color: 'text-purple-600', icon: Mic },
    audio: { bg: 'bg-blue-100', color: 'text-blue-600', icon: Mic },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {media.map(m => {
        const config = typeConfig[m.type] || typeConfig.audio
        const Icon = config.icon
        const isPlaying = playing === m.id

        return (
          <div key={m.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <button onClick={() => setPlaying(isPlaying ? null : m.id)}
              className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center shrink-0 hover:scale-105 transition-transform`}>
              {isPlaying ? <Pause size={20} className={config.color} /> : <Icon size={20} className={config.color} />}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-gray-900">{m.title}</h3>
              <span className="text-xs text-gray-400 capitalize">{m.type}</span>
              {isPlaying && (
                <div className="mt-1.5">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full animate-progress" style={{ width: '35%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>1:23</span><span>3:45</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ProviderPage({ providers, favorites = [], toggleFavorite }) {
  const { id } = useParams()
  const provider = providers.find(p => p.id === parseInt(id))

  if (!provider) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-500">Provider not found</h2>
    </div>
  )

  const trustScore = calculateTrustScore(provider)
  const contractId = `SC-${Date.now()}-${provider.id}`
  const qrData = JSON.stringify({
    contractId,
    provider: provider.name,
    timestamp: new Date().toISOString(),
    blockchain: 'toggle-chain'
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative shrink-0">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl ${
              provider.available ? 'bg-brand-600' : 'bg-gray-400'
            }`}>
              {provider.name.charAt(0)}
            </div>
            {provider.available && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white animate-pulse" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
              {provider.available ? (
                <span className="badge-available"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Available Now</span>
              ) : (
                <span className="badge-unavailable"><span className="w-2 h-2 rounded-full bg-red-400" />Unavailable</span>
              )}
              <TrustBadge score={trustScore} />
            </div>
            <p className="text-gray-600 mb-3">{provider.description}</p>

            {/* Verification Badges */}
            <div className="mb-3">
              <VerificationBadges provider={provider} />
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500" />{provider.rating} ({provider.reviewCount} reviews)</span>
              <span className="flex items-center gap-1"><Clock size={16} />{provider.hours.open} - {provider.hours.close}, {provider.hours.days}</span>
              <span className="flex items-center gap-1"><DollarSign size={16} />${provider.hourlyRate}/hr</span>
              <span className="flex items-center gap-1"><MapPin size={16} />{provider.location.address}</span>
              <span className="flex items-center gap-1"><Phone size={16} />{provider.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-gray-100">
          <Link to={`/messages/${provider.id}`} className="btn-primary flex items-center gap-2">
            <MessageSquare size={16} /> Message
          </Link>
          <Link to={`/quote/${provider.id}`} className="btn-accent flex items-center gap-2">
            <Calculator size={16} /> Get Quote
          </Link>
          <a href={`tel:${provider.phone}`} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Phone size={16} /> Call
          </a>
          <Link to={`/booking/${provider.id}`} className="px-6 py-3 rounded-xl bg-brand-100 text-brand-700 font-semibold hover:bg-brand-200 transition-colors flex items-center gap-2">
            <Clock size={16} /> Book Now
          </Link>
          <button onClick={() => toggleFavorite?.(provider.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              favorites.includes(provider.id) ? 'bg-red-50 text-red-500 border border-red-200' : 'border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}>
            <Heart size={16} className={favorites.includes(provider.id) ? 'fill-red-500' : ''} />
            {favorites.includes(provider.id) ? 'Saved' : 'Save'}
            {provider.favoriteCount && <span className="text-xs text-gray-400 ml-1">({provider.favoriteCount})</span>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Services */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Services Offered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {provider.services.map(s => (
                <div key={s} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <ChevronRight size={16} className="text-brand-500" />
                  <span className="text-sm font-medium text-gray-700">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Before/After Portfolio */}
          {provider.portfolio && provider.portfolio.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye size={18} /> Work Portfolio
              </h2>
              <BeforeAfterGallery items={provider.portfolio} />
            </div>
          )}

          {/* Reviews */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Reviews ({provider.reviewCount})</h2>
              <Link to="/reviews" className="text-sm text-brand-600 font-medium hover:text-brand-700">See all reviews</Link>
            </div>
            <div className="space-y-4">
              {provider.reviews.map(r => (
                <div key={r.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-semibold text-sm">
                        {r.user.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{r.user}</span>
                    </div>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={12} className={i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Blog */}
          {provider.blog.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={18} /> Blog Posts
              </h2>
              <div className="space-y-3">
                {provider.blog.map(b => (
                  <div key={b.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">{b.excerpt}</p>
                    <span className="text-xs text-gray-400">{b.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Player */}
          {provider.media.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Play size={18} /> Media
              </h2>
              <MediaPlayer media={provider.media} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trust Score */}
          <div className="card p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-3">Trust Score</h3>
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none"
                  stroke={trustScore >= 90 ? '#22c55e' : trustScore >= 75 ? '#3b82f6' : '#f59e0b'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${trustScore * 2.64} ${264 - trustScore * 2.64}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{trustScore}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Based on ratings, reviews, response time, and verification</p>
          </div>

          {/* QR Code */}
          <div className="card p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-3">Service Contract QR</h3>
            <p className="text-xs text-gray-500 mb-4">Scan to verify on blockchain</p>
            <div className="inline-block p-3 bg-white border-2 border-gray-100 rounded-xl">
              <QRCodeSVG value={qrData} size={160} level="H"
                fgColor="#1647b6" bgColor="#ffffff" />
            </div>
            <p className="text-xs text-gray-400 mt-3 font-mono break-all">ID: {contractId}</p>
            <Link to={`/blockchain?contract=${contractId}`}
              className="mt-3 inline-flex items-center gap-1 text-xs text-brand-600 font-medium hover:text-brand-700">
              View on Blockchain Explorer →
            </Link>
          </div>

          {/* Quick Info */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Response Time</dt><dd className="font-medium">{provider.responseTime}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Hourly Rate</dt><dd className="font-medium">${provider.hourlyRate}/hr</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Distance</dt><dd className="font-medium">{provider.distance} mi</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Total Reviews</dt><dd className="font-medium">{provider.reviewCount}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Member Since</dt><dd className="font-medium">Jan 2025</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Jobs Completed</dt><dd className="font-medium">{Math.round(provider.reviewCount * 1.4)}</dd></div>
            </dl>
          </div>

          {/* Samiteon Payment */}
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-samiteon-500 to-samiteon-700 p-6 text-white">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">S</span>
                </div>
                <span className="text-sm font-medium text-white/70">Samiteon</span>
              </div>
              <p className="font-mono text-lg tracking-wider mb-3">**** **** **** 8842</p>
              <div className="flex justify-between text-xs text-white/60">
                <span>CHARGE CARD</span>
                <span>VALID THRU 12/28</span>
              </div>
            </div>
            <div className="p-4 bg-samiteon-50">
              <p className="text-xs text-samiteon-700 mb-2">Secure payment through Samiteon charge card services</p>
              <button className="w-full bg-samiteon-600 text-white font-semibold py-2.5 rounded-xl hover:bg-samiteon-700 transition-colors text-sm">
                Pay with Samiteon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
