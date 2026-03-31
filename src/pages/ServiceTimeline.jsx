import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, CheckCircle, Star, DollarSign, MessageSquare, Gift, Award, Filter, Clock } from 'lucide-react'
import { users as usersApi, payments as paymentsApi } from '../lib/api'

const eventColors = {
  booking: 'blue-500',
  payment: 'green-500',
  review: 'yellow-500',
  message: 'purple-500',
  referral: 'pink-500',
  reward: 'orange-500',
}

const eventIcons = {
  booking: Calendar,
  payment: DollarSign,
  review: Star,
  message: MessageSquare,
  referral: Gift,
  reward: Award,
}

const filterOptions = [
  { key: 'all', label: 'All', icon: Filter },
  { key: 'booking', label: 'Bookings', icon: Calendar },
  { key: 'payment', label: 'Payments', icon: DollarSign },
  { key: 'review', label: 'Reviews', icon: Star },
  { key: 'message', label: 'Messages', icon: MessageSquare },
  { key: 'reward', label: 'Rewards', icon: Gift },
]

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  )
}

export default function ServiceTimeline() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [timelineEvents, setTimelineEvents] = useState([])
  const [allPayments, setAllPayments] = useState([])

  useEffect(() => {
    // Build timeline from bookings
    usersApi.bookings().then(bookings => {
      const events = bookings.map((b, i) => ({
        id: i + 1, type: 'booking', title: `Booked ${b.service}`,
        provider: b.provider, providerId: b.providerId,
        date: b.date, time: b.startTime ? `${b.startTime}` : '9:00 AM',
        cost: b.amount, status: b.status, rating: b.status === 'completed' ? 5 : null,
      }))
      setTimelineEvents(events)
    }).catch(() => {})

    paymentsApi.list().then(setAllPayments).catch(() => {})
  }, [])

  const totalSpent = allPayments.reduce((sum, c) => sum + (c.amount || 0), 0)
  const servicesCompleted = timelineEvents.filter(e => e.type === 'booking' && e.status === 'completed').length
  const uniqueProviders = new Set(timelineEvents.filter(e => e.providerId).map(e => e.providerId)).size
  const ratedEvents = timelineEvents.filter(e => e.rating)
  const avgRating = ratedEvents.length
    ? (ratedEvents.reduce((sum, e) => sum + e.rating, 0) / ratedEvents.length).toFixed(1)
    : '0.0'

  const sortedEvents = [...timelineEvents]
    .filter(e => activeFilter === 'all' || e.type === activeFilter)
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateB - dateA
    })

  const stats = [
    { label: 'Total Spent', value: `$${totalSpent}`, icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { label: 'Services Completed', value: servicesCompleted, icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    { label: 'Unique Providers', value: uniqueProviders, icon: Calendar, color: 'text-purple-600 bg-purple-50' },
    { label: 'Average Rating', value: avgRating, icon: Star, color: 'text-yellow-600 bg-yellow-50' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Timeline</h1>
          <p className="text-gray-500">Your complete service history at a glance</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterOptions.map(opt => {
            const Icon = opt.icon
            const isActive = activeFilter === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => setActiveFilter(opt.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {sortedEvents.map((event, index) => {
              const Icon = eventIcons[event.type] || Calendar
              const color = eventColors[event.type] || 'gray-400'
              const isExpanded = expandedId === event.id
              const isEven = index % 2 === 0

              return (
                <div key={event.id} className="relative pl-14">
                  {/* Colored dot */}
                  <div
                    className={`absolute left-3 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-${color}`}
                    style={{ top: '1.25rem' }}
                  >
                    <Icon size={10} className="text-white" />
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : event.id)}
                    className={`rounded-xl p-5 shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md ${
                      isEven ? 'bg-white' : 'bg-gray-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-block w-2 h-2 rounded-full bg-${color}`} />
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        </div>
                        {event.provider && (
                          <Link
                            to={`/provider/${event.providerId}`}
                            onClick={e => e.stopPropagation()}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {event.provider}
                          </Link>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-400 flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{event.date}</span>
                        <span className="text-gray-300">|</span>
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Summary details always visible */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      {event.cost !== undefined && (
                        <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                          <DollarSign size={14} />
                          ${event.cost}
                        </span>
                      )}
                      {event.rating && <RatingStars rating={event.rating} />}
                      {event.status && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          event.status === 'completed' ? 'bg-green-100 text-green-700' :
                          event.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {event.status}
                        </span>
                      )}
                      {event.text && !isExpanded && (
                        <span className="text-gray-400 truncate max-w-xs">
                          {event.text.length > 40 ? event.text.slice(0, 40) + '...' : event.text}
                        </span>
                      )}
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {event.text && (
                          <p className="text-sm text-gray-600 mb-3">{event.text}</p>
                        )}
                        {event.type === 'booking' && event.providerId && (
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/booking/${event.providerId}`}
                              onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Calendar size={14} />
                              Book Again
                            </Link>
                            <Link
                              to={`/messages/${event.providerId}`}
                              onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              <MessageSquare size={14} />
                              Message
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {sortedEvents.length === 0 && (
            <div className="text-center py-16">
              <Filter size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No events match this filter</p>
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-3 text-blue-600 hover:underline text-sm"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
