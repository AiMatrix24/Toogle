import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Star, Clock, DollarSign, MapPin, Shield, CheckCircle, X, ArrowLeft, Users } from 'lucide-react'

function calculateTrustScore(provider) {
  return Math.round(
    (provider.rating / 5) * 35 +
    Math.min(provider.reviewCount / 300, 1) * 25 +
    (provider.available ? 15 : 5) +
    (provider.responseTime.includes('15') ? 15 : provider.responseTime.includes('20') ? 13 : provider.responseTime.includes('30') ? 10 : 5) +
    10
  )
}

function parseResponseMinutes(responseTime) {
  if (responseTime.includes('15')) return 15
  if (responseTime.includes('20')) return 20
  if (responseTime.includes('30')) return 30
  if (responseTime.includes('45')) return 45
  if (responseTime.includes('1 hr') || responseTime.includes('1hr')) return 60
  if (responseTime.includes('2')) return 120
  return 180
}

function getBestIndex(values, mode) {
  if (values.length === 0) return -1
  if (mode === 'lowest') {
    const min = Math.min(...values.filter(v => v !== null))
    return values.indexOf(min)
  }
  const max = Math.max(...values.filter(v => v !== null))
  return values.indexOf(max)
}

export default function CompareProviders({ providers }) {
  const [searchParams] = useSearchParams()
  const idsParam = searchParams.get('ids') || ''

  const selectedProviders = useMemo(() => {
    const ids = idsParam.split(',').map(Number).filter(Boolean)
    return ids.slice(0, 4).map(id => providers?.find(p => p.id === id)).filter(Boolean)
  }, [idsParam, providers])

  // Collect all unique services across selected providers
  const allServices = useMemo(() => {
    const serviceSet = new Set()
    selectedProviders.forEach(p => p.services.forEach(s => serviceSet.add(s)))
    return Array.from(serviceSet).sort()
  }, [selectedProviders])

  if (selectedProviders.length < 2) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card p-10">
          <Users size={56} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare Providers</h2>
          <p className="text-gray-500 mb-6">
            Select at least 2 providers from the home page to compare them side by side.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Browse Providers
          </Link>
        </div>
      </div>
    )
  }

  const trustScores = selectedProviders.map(calculateTrustScore)
  const hourlyRates = selectedProviders.map(p => p.hourlyRate)
  const ratings = selectedProviders.map(p => p.rating)
  const reviewCounts = selectedProviders.map(p => p.reviewCount)
  const responseMinutes = selectedProviders.map(p => parseResponseMinutes(p.responseTime))
  const distances = selectedProviders.map(p => p.distance)

  const bestTrust = getBestIndex(trustScores, 'highest')
  const bestRate = getBestIndex(hourlyRates, 'lowest')
  const bestRating = getBestIndex(ratings, 'highest')
  const bestReviews = getBestIndex(reviewCounts, 'highest')
  const bestResponse = getBestIndex(responseMinutes, 'lowest')
  const bestDistance = getBestIndex(distances, 'lowest')

  const colCount = selectedProviders.length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compare Providers</h1>
          <p className="text-sm text-gray-500">Side-by-side comparison of {colCount} providers</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Provider Headers */}
            <thead>
              <tr className="border-b border-gray-100">
                <th className="p-4 text-left text-sm font-medium text-gray-500 w-40 min-w-[140px]">Provider</th>
                {selectedProviders.map(provider => (
                  <th key={provider.id} className="p-4 text-center min-w-[180px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl ${
                        provider.available ? 'bg-brand-600' : 'bg-gray-400'
                      }`}>
                        {provider.name.charAt(0)}
                      </div>
                      <div>
                        <Link to={`/provider/${provider.id}`} className="font-semibold text-gray-900 hover:text-brand-600 transition-colors text-sm">
                          {provider.name}
                        </Link>
                        <p className="text-xs text-gray-500">{provider.category}</p>
                      </div>
                      {provider.available ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          Unavailable
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {/* Trust Score */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2"><Shield size={16} className="text-blue-500" /> Trust Score</div>
                </td>
                {trustScores.map((score, i) => (
                  <td key={i} className={`p-4 text-center font-bold text-lg ${i === bestTrust ? 'bg-green-50 text-green-700' : 'text-gray-900'}`}>
                    {score}
                    <span className="text-xs font-normal text-gray-400">/100</span>
                  </td>
                ))}
              </tr>

              {/* Hourly Rate */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2"><DollarSign size={16} className="text-green-500" /> Hourly Rate</div>
                </td>
                {selectedProviders.map((p, i) => (
                  <td key={i} className={`p-4 text-center font-semibold ${i === bestRate ? 'bg-green-50 text-green-700' : 'text-gray-900'}`}>
                    ${p.hourlyRate}/hr
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2"><Star size={16} className="text-yellow-500" /> Rating</div>
                </td>
                {selectedProviders.map((p, i) => (
                  <td key={i} className={`p-4 text-center ${i === bestRating ? 'bg-green-50' : ''}`}>
                    <div className="flex items-center justify-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className={`font-semibold ${i === bestRating ? 'text-green-700' : 'text-gray-900'}`}>{p.rating}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Review Count */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2"><Star size={16} className="text-gray-400" /> Reviews</div>
                </td>
                {selectedProviders.map((p, i) => (
                  <td key={i} className={`p-4 text-center font-semibold ${i === bestReviews ? 'bg-green-50 text-green-700' : 'text-gray-900'}`}>
                    {p.reviewCount}
                  </td>
                ))}
              </tr>

              {/* Response Time */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2"><Clock size={16} className="text-orange-500" /> Response Time</div>
                </td>
                {selectedProviders.map((p, i) => (
                  <td key={i} className={`p-4 text-center font-semibold ${i === bestResponse ? 'bg-green-50 text-green-700' : 'text-gray-900'}`}>
                    {p.responseTime}
                  </td>
                ))}
              </tr>

              {/* Distance */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-red-500" /> Distance</div>
                </td>
                {selectedProviders.map((p, i) => (
                  <td key={i} className={`p-4 text-center font-semibold ${i === bestDistance ? 'bg-green-50 text-green-700' : 'text-gray-900'}`}>
                    {p.distance} mi
                  </td>
                ))}
              </tr>

              {/* Availability */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Availability</div>
                </td>
                {selectedProviders.map((p, i) => (
                  <td key={i} className="p-4 text-center">
                    {p.available ? (
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium text-sm">
                        <CheckCircle size={16} /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 font-medium text-sm">
                        <X size={16} /> Unavailable
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Services section header */}
              <tr>
                <td colSpan={colCount + 1} className="px-4 pt-6 pb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Services</span>
                </td>
              </tr>

              {/* Service rows */}
              {allServices.map(service => (
                <tr key={service}>
                  <td className="px-4 py-2 text-sm text-gray-600">{service}</td>
                  {selectedProviders.map((p, i) => (
                    <td key={i} className="px-4 py-2 text-center">
                      {p.services.includes(service) ? (
                        <CheckCircle size={18} className="mx-auto text-green-500" />
                      ) : (
                        <X size={18} className="mx-auto text-gray-300" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Action Buttons */}
              <tr className="border-t border-gray-100">
                <td className="p-4" />
                {selectedProviders.map(p => (
                  <td key={p.id} className="p-4">
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/booking/${p.id}`}
                        className="w-full text-center px-4 py-2.5 rounded-xl bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors"
                      >
                        Book Now
                      </Link>
                      <Link
                        to={`/messages/${p.id}`}
                        className="w-full text-center px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                      >
                        Message
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
