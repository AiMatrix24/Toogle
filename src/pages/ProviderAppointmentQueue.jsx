import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, DollarSign, MapPin, Shield, CheckCircle, XCircle, Zap, Star, AlertCircle } from 'lucide-react'
import { qadeAppointments } from '../lib/api'

function CountdownTimer({ offeredAt }) {
  const [remaining, setRemaining] = useState(60)

  useEffect(() => {
    const calc = () => {
      const elapsed = (Date.now() - new Date(offeredAt + (offeredAt.includes('Z') ? '' : 'Z')).getTime()) / 1000
      setRemaining(Math.max(0, 60 - Math.floor(elapsed)))
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [offeredAt])

  const color = remaining > 30 ? 'text-green-600' : remaining > 10 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className={`text-2xl font-mono font-bold ${color}`} aria-label={`${remaining} seconds remaining`}>
      0:{String(remaining).padStart(2, '0')}
    </div>
  )
}

export default function ProviderAppointmentQueue() {
  const [offers, setOffers] = useState([])
  const [queue, setQueue] = useState([])
  const [activeTab, setActiveTab] = useState('offers')
  const [responding, setResponding] = useState(null)

  const loadData = () => {
    qadeAppointments.offered().then(setOffers).catch(() => {})
    qadeAppointments.providerQueue().then(setQueue).catch(() => {})
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(() => {
      if (activeTab === 'offers') qadeAppointments.offered().then(setOffers).catch(() => {})
    }, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [activeTab])

  const handleRespond = async (appointmentId, action) => {
    setResponding(appointmentId)
    try {
      await qadeAppointments.respond(appointmentId, action)
      loadData()
    } catch (err) {
      alert('Failed: ' + err.message)
    } finally {
      setResponding(null)
    }
  }

  const handleOutcome = async (appointmentId, outcome) => {
    await qadeAppointments.outcome(appointmentId, { outcome })
    loadData()
  }

  const tabs = [
    { id: 'offers', label: 'Pending Offers', count: offers.length },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
  ]

  const upcoming = queue.filter(a => ['SCHEDULING', 'CONFIRMED', 'ACCEPTED'].includes(a.status))
  const past = queue.filter(a => ['COMPLETED', 'NO_SHOW', 'CANCELLED', 'IN_PROGRESS'].includes(a.status))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Queue</h1>
          <p className="text-gray-500 text-sm">Qualified appointment offers and your schedule</p>
        </div>
        <Link to="/dashboard" className="text-sm text-brand-600 font-medium hover:text-brand-700">Back to Dashboard</Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === t.id ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {t.label}
            {t.count > 0 && <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Pending Offers */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          {offers.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <Clock size={40} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium">No pending offers</p>
              <p className="text-sm mt-1">New appointment offers will appear here automatically</p>
            </div>
          ) : offers.map(o => (
            <div key={o.id} className="card p-6 border-2 border-brand-200 bg-brand-50/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={16} className="text-brand-600" />
                    <span className="text-xs font-bold text-brand-600 uppercase">New Appointment Offer</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Tier {o.tier}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="capitalize font-medium">{o.insuranceType} Insurance</span>
                    <span className="flex items-center gap-1"><MapPin size={14} />{o.zip}, {o.state}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${o.qualificationScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      Score: {o.qualificationScore}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <CountdownTimer offeredAt={o.offeredAt} />
                  <p className="text-xs text-gray-400 mt-1">seconds left</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-brand-200">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-600" />
                  <span className="font-bold text-green-700">${o.estimatedFee} appointment fee</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRespond(o.id, 'decline')} disabled={responding === o.id}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium disabled:opacity-50">
                    <XCircle size={16} /> Decline
                  </button>
                  <button onClick={() => handleRespond(o.id, 'accept')} disabled={responding === o.id}
                    className="flex items-center gap-1 px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 text-sm font-bold disabled:opacity-50">
                    <CheckCircle size={16} /> Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming */}
      {activeTab === 'upcoming' && (
        <div className="space-y-3">
          {upcoming.length === 0 ? (
            <div className="card p-8 text-center text-gray-400">No upcoming appointments</div>
          ) : upcoming.map(a => (
            <div key={a.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{a.firstName} {a.lastName}</p>
                  <p className="text-sm text-gray-500 capitalize">{a.insuranceType} &middot; {a.zip}, {a.state}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700`}>{a.status}</span>
              </div>
              {a.scheduledDate && <p className="text-sm text-gray-600">{a.scheduledDate} at {a.scheduledStart}</p>}
              <div className="flex gap-2 mt-3">
                {a.status === 'CONFIRMED' && (
                  <button onClick={async () => { await qadeAppointments.start(a.id); loadData() }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Start</button>
                )}
                {a.status === 'IN_PROGRESS' && (
                  <button onClick={async () => { await qadeAppointments.complete(a.id); loadData() }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700">Complete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past */}
      {activeTab === 'past' && (
        <div className="space-y-3">
          {past.length === 0 ? (
            <div className="card p-8 text-center text-gray-400">No past appointments</div>
          ) : past.map(a => (
            <div key={a.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{a.firstName} {a.lastName}</p>
                  <p className="text-sm text-gray-500 capitalize">{a.insuranceType} &middot; {a.scheduledDate}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  a.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>{a.status}</span>
              </div>
              {a.outcome ? (
                <p className="text-sm text-gray-500">Outcome: <span className="font-medium capitalize">{a.outcome.replace('_', ' ')}</span></p>
              ) : a.status === 'COMPLETED' && (
                <div className="flex gap-2 mt-2">
                  {['closed_sale', 'no_sale', 'follow_up'].map(o => (
                    <button key={o} onClick={() => handleOutcome(a.id, o)}
                      className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 capitalize">
                      {o.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
