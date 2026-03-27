import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Clock, DollarSign, Phone, MessageSquare, Calculator, Play, Mic, FileText, ChevronRight } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function ProviderPage({ providers }) {
  const { id } = useParams()
  const provider = providers.find(p => p.id === parseInt(id))

  if (!provider) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-500">Provider not found</h2>
    </div>
  )

  const contractId = `SC-${Date.now()}-${provider.id}`
  const qrData = JSON.stringify({
    contractId,
    provider: provider.name,
    timestamp: new Date().toISOString(),
    blockchain: 'toogle-chain'
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shrink-0 ${
            provider.available ? 'bg-brand-600' : 'bg-gray-400'
          }`}>
            {provider.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
              {provider.available ? (
                <span className="badge-available"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Available Now</span>
              ) : (
                <span className="badge-unavailable"><span className="w-2 h-2 rounded-full bg-red-400" />Unavailable</span>
              )}
            </div>
            <p className="text-gray-600 mb-3">{provider.description}</p>
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

          {/* Reviews */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Reviews ({provider.reviewCount})</h2>
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

          {/* Media */}
          {provider.media.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Media</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {provider.media.map(m => (
                  <div key={m.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                    {m.type === 'video' && <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><Play size={18} className="text-red-600" /></div>}
                    {m.type === 'podcast' && <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Mic size={18} className="text-purple-600" /></div>}
                    {m.type === 'audio' && <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Mic size={18} className="text-blue-600" /></div>}
                    <div>
                      <h3 className="font-medium text-sm text-gray-900">{m.title}</h3>
                      <span className="text-xs text-gray-400 capitalize">{m.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="card p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-3">Service Contract QR</h3>
            <p className="text-xs text-gray-500 mb-4">Scan to verify on blockchain</p>
            <div className="inline-block p-3 bg-white border-2 border-gray-100 rounded-xl">
              <QRCodeSVG value={qrData} size={160} level="H"
                fgColor="#1647b6" bgColor="#ffffff"
                imageSettings={{ src: '', height: 0, width: 0, excavate: false }} />
            </div>
            <p className="text-xs text-gray-400 mt-3 font-mono break-all">ID: {contractId}</p>
          </div>

          {/* Quick Info */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Response Time</dt><dd className="font-medium">{provider.responseTime}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Hourly Rate</dt><dd className="font-medium">${provider.hourlyRate}/hr</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Distance</dt><dd className="font-medium">{provider.distance} mi</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Total Reviews</dt><dd className="font-medium">{provider.reviewCount}</dd></div>
            </dl>
          </div>

          {/* Samiteon Payment */}
          <div className="card p-6 bg-gradient-to-br from-samiteon-500 to-samiteon-700 text-white">
            <h3 className="font-bold mb-2">Pay with Samiteon</h3>
            <p className="text-sm text-white/80 mb-4">Secure payment through Samiteon charge card services</p>
            <button className="w-full bg-white text-samiteon-700 font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors">
              Connect Samiteon Card
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
