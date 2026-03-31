import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Briefcase, DollarSign, BarChart3, Shield, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { admin as adminApi } from '../lib/api'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [providers, setProviders] = useState([])
  const [tickets, setTickets] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    adminApi.stats().then(setStats).catch(() => {})
    adminApi.users().then(setUsers).catch(() => {})
    adminApi.providers().then(setProviders).catch(() => {})
    adminApi.tickets().then(setTickets).catch(() => {})
  }, [user])

  const handleVerify = async (providerId) => {
    await adminApi.verifyProvider(providerId)
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, verified: true } : p))
  }

  const handleTicketStatus = async (ticketId, status) => {
    await adminApi.updateTicket(ticketId, { status })
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t))
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'providers', label: 'Providers', icon: Briefcase },
    { id: 'tickets', label: 'Tickets', icon: AlertCircle },
  ]

  const statusColors = {
    open: 'bg-red-100 text-red-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Platform management and operations</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === t.id ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-700' },
            { label: 'Providers', value: stats.totalProviders, icon: Briefcase, color: 'bg-purple-50 text-purple-700' },
            { label: 'Total Bookings', value: stats.totalBookings, icon: Clock, color: 'bg-green-50 text-green-700' },
            { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Avg Rating', value: stats.avgRating, icon: CheckCircle, color: 'bg-orange-50 text-orange-700' },
            { label: 'Active Customers', value: stats.activeCustomers, icon: Users, color: 'bg-teal-50 text-teal-700' },
            { label: 'Open Tickets', value: stats.openTickets, icon: AlertCircle, color: 'bg-red-50 text-red-700' },
            { label: 'Pending Verification', value: stats.pendingProviders, icon: Shield, color: 'bg-amber-50 text-amber-700' },
          ].map(s => (
            <div key={s.label} className={`card p-5 ${s.color}`}>
              <s.icon size={20} className="opacity-60 mb-2" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..." className="input-field pl-10 text-sm py-2" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Name</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Email</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Role</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Joined</th>
              </tr></thead>
              <tbody>
                {users.filter(u => !searchQuery ||
                  u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.email?.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(u => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{u.name}</td>
                    <td className="py-3 px-2 text-gray-500">{u.email}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700'
                        : u.role === 'provider' ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>{u.role}</span>
                    </td>
                    <td className="py-3 px-2 text-gray-400">{u.created_at?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-3">
          {providers.map(p => (
            <div key={p.id} className="card p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${p.verified ? 'bg-green-600' : 'bg-gray-400'}`}>
                  {p.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-xs text-gray-500">{p.category} &middot; {p.email} &middot; ${p.hourlyRate}/hr</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {p.verified ? (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                    <CheckCircle size={12} /> Verified
                  </span>
                ) : (
                  <button onClick={() => handleVerify(p.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700">
                    Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="card p-8 text-center text-gray-400">No support tickets yet</div>
          ) : tickets.map(t => (
            <div key={t.id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{t.subject}</h3>
                  <p className="text-xs text-gray-500">{t.userName} ({t.userEmail}) &middot; {t.createdAt?.split('T')[0]}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[t.status] || statusColors.open}`}>
                  {t.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{t.description}</p>
              <div className="flex gap-2">
                {t.status === 'open' && (
                  <button onClick={() => handleTicketStatus(t.id, 'in-progress')}
                    className="text-xs px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200">
                    Start Working
                  </button>
                )}
                {(t.status === 'open' || t.status === 'in-progress') && (
                  <button onClick={() => handleTicketStatus(t.id, 'resolved')}
                    className="text-xs px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200">
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
