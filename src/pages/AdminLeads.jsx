import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Users, CheckCircle, AlertCircle, Clock, Zap, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { qadeAppointments } from '../lib/api'

const scoreColor = (score) => score >= 80 ? 'text-green-600 bg-green-50' : score >= 60 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
const statusBadge = {
  SUBMITTED: 'bg-gray-100 text-gray-700',
  QUALIFYING: 'bg-yellow-100 text-yellow-700',
  QUALIFIED: 'bg-green-100 text-green-700',
  MATCHING: 'bg-blue-100 text-blue-700',
  OFFERED: 'bg-purple-100 text-purple-700',
  ACCEPTED: 'bg-indigo-100 text-indigo-700',
  SCHEDULING: 'bg-teal-100 text-teal-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-orange-100 text-orange-700',
  COMPLETED: 'bg-green-100 text-green-700',
  NO_SHOW: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
}

export default function AdminLeads() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [filters, setFilters] = useState({ source: '', insuranceType: '', minScore: '', maxScore: '' })
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return }
    loadLeads()
    qadeAppointments.analyticsSummary().then(setAnalytics).catch(() => {})
  }, [user])

  const loadLeads = () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    qadeAppointments.listLeads(params).then(setLeads).catch(() => {})
  }

  const handleMatch = async (appointmentId) => {
    const result = await qadeAppointments.match(appointmentId)
    alert(`Found ${result.totalMatches} matches. Top score: ${result.matches[0]?.compositeScore || 'N/A'}`)
  }

  const handleDispatch = async (appointmentId) => {
    const result = await qadeAppointments.dispatch(appointmentId)
    alert(result.ok ? `Dispatched to Tier ${result.tier}` : result.reason)
    loadLeads()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-500 text-sm">Module 29 — Qualified Appointment Distribution Engine</p>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Leads', value: analytics.totalLeads, icon: Users, color: 'bg-blue-50 text-blue-700' },
            { label: 'Qualified', value: `${analytics.qualificationRate}%`, icon: CheckCircle, color: 'bg-green-50 text-green-700' },
            { label: 'Close Rate', value: `${analytics.closeRate}%`, icon: Zap, color: 'bg-purple-50 text-purple-700' },
            { label: 'Total Fees', value: `$${analytics.totalFees.toLocaleString()}`, icon: Clock, color: 'bg-yellow-50 text-yellow-700' },
          ].map(s => (
            <div key={s.label} className={`card p-4 ${s.color}`}>
              <s.icon size={18} className="opacity-60 mb-1" aria-hidden="true" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Insurance Type</label>
          <select value={filters.insuranceType} onChange={(e) => setFilters(p => ({ ...p, insuranceType: e.target.value }))}
            className="input-field text-sm py-2 w-36">
            <option value="">All</option>
            {['health','medicare','life','auto','home','commercial'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
          <select value={filters.source} onChange={(e) => setFilters(p => ({ ...p, source: e.target.value }))}
            className="input-field text-sm py-2 w-32">
            <option value="">All</option>
            {['web_form','partner_api','referral','ivr','sms'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Min Score</label>
          <input type="number" value={filters.minScore} onChange={(e) => setFilters(p => ({ ...p, minScore: e.target.value }))}
            className="input-field text-sm py-2 w-20" placeholder="0" />
        </div>
        <button onClick={loadLeads} className="btn-primary text-sm py-2 px-4">
          <Filter size={14} className="inline mr-1" /> Filter
        </button>
      </div>

      {/* Leads Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Location</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Source</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Score</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">TCPA</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{l.firstName} {l.lastName}</p>
                    <p className="text-xs text-gray-400">{l.email}</p>
                  </td>
                  <td className="py-3 px-4 capitalize">{l.insuranceType}</td>
                  <td className="py-3 px-4">{l.zipCode}, {l.state}</td>
                  <td className="py-3 px-4 text-xs">{l.source}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${scoreColor(l.qualificationScore)}`}>
                      {l.qualificationScore}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge[l.appointmentStatus] || 'bg-gray-100 text-gray-600'}`}>
                      {l.appointmentStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {l.tcpaConsent ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-red-400" />}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {l.appointmentStatus === 'QUALIFIED' && (
                        <button onClick={() => handleMatch(l.appointmentId)} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Match</button>
                      )}
                      {l.appointmentStatus === 'MATCHING' && (
                        <button onClick={() => handleDispatch(l.appointmentId)} className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200">Dispatch</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-gray-400">No leads found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
