import { useState } from 'react'
import { TrendingUp, Users, DollarSign, Star, Calendar, ArrowUp, ArrowDown, BarChart3, PieChart } from 'lucide-react'

function MiniChart({ data, color = '#338dff', height = 40 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100 / (data.length - 1)

  const points = data.map((v, i) => `${i * w},${height - ((v - min) / range) * (height - 4)}`).join(' ')

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BarChart({ data, labels }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-gray-600">{v}</span>
          <div className="w-full bg-brand-500 rounded-t-lg transition-all hover:bg-brand-600"
            style={{ height: `${(v / max) * 100}%`, minHeight: '4px' }} />
          <span className="text-xs text-gray-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ segments }) {
  const total = segments.reduce((a, s) => a + s.value, 0)
  let cumulative = 0

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {segments.map((s, i) => {
          const percent = (s.value / total) * 100
          const offset = cumulative
          cumulative += percent
          return (
            <circle key={i} cx="18" cy="18" r="15.9" fill="none"
              stroke={s.color} strokeWidth="3"
              strokeDasharray={`${percent} ${100 - percent}`}
              strokeDashoffset={`${-offset}`}
              className="transition-all" />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{total}</span>
        <span className="text-xs text-gray-400">Total</span>
      </div>
    </div>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('month')

  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+18%', up: true, icon: DollarSign, color: 'bg-green-50 text-green-700',
      chart: [800, 920, 1100, 980, 1250, 1400, 1350, 1500, 1300, 1600, 1450, 1795] },
    { label: 'Total Bookings', value: '184', change: '+12%', up: true, icon: Calendar, color: 'bg-blue-50 text-blue-700',
      chart: [12, 15, 14, 18, 16, 20, 22, 19, 21, 24, 18, 23] },
    { label: 'Active Customers', value: '1,247', change: '+8%', up: true, icon: Users, color: 'bg-purple-50 text-purple-700',
      chart: [90, 95, 100, 105, 108, 112, 118, 120, 125, 130, 128, 135] },
    { label: 'Avg Rating', value: '4.8', change: '-0.1', up: false, icon: Star, color: 'bg-yellow-50 text-yellow-700',
      chart: [4.7, 4.8, 4.9, 4.8, 4.7, 4.8, 4.9, 4.8, 4.8, 4.9, 4.8, 4.8] },
  ]

  const bookingsByMonth = [28, 32, 24, 38, 42, 35, 45]
  const monthLabels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

  const categoryData = [
    { label: 'Plumbing', value: 45, color: '#338dff' },
    { label: 'Electrical', value: 32, color: '#10b981' },
    { label: 'Cleaning', value: 28, color: '#7c3aed' },
    { label: 'HVAC', value: 18, color: '#f59e0b' },
    { label: 'Other', value: 12, color: '#94a3b8' },
  ]

  const topProviders = [
    { name: "Mike's Plumbing Pro", bookings: 42, revenue: 3570, rating: 4.8 },
    { name: 'Spark Electric Solutions', bookings: 38, revenue: 3610, rating: 4.9 },
    { name: 'Pristine Clean Co.', bookings: 56, revenue: 3080, rating: 4.7 },
    { name: 'GreenScape Landscaping', bookings: 24, revenue: 1560, rating: 4.5 },
    { name: 'CoolBreeze HVAC', bookings: 18, revenue: 1980, rating: 4.6 },
  ]

  const recentActivity = [
    { action: 'New booking', detail: 'Leak Repair - Mike\'s Plumbing Pro', time: '2 min ago', type: 'booking' },
    { action: 'Payment received', detail: '$120 via Samiteon', time: '15 min ago', type: 'payment' },
    { action: 'New review', detail: '5 stars for Pristine Clean Co.', time: '1 hr ago', type: 'review' },
    { action: 'Provider joined', detail: 'QuickFix Handyman Services', time: '3 hrs ago', type: 'signup' },
    { action: 'Dispute resolved', detail: 'DSP-438291 closed', time: '5 hrs ago', type: 'dispute' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500">Platform performance overview</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                period === p ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <Icon size={18} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                  {s.up ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mb-2">{s.label}</p>
              <MiniChart data={s.chart} color={s.up ? '#10b981' : '#ef4444'} />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bookings Chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 size={18} className="text-brand-500" /> Bookings by Month
            </h2>
          </div>
          <BarChart data={bookingsByMonth} labels={monthLabels} />
        </div>

        {/* Category Breakdown */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-brand-500" /> By Category
          </h2>
          <DonutChart segments={categoryData} />
          <div className="mt-4 space-y-2">
            {categoryData.map(c => (
              <div key={c.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-gray-600">{c.label}</span>
                </div>
                <span className="font-medium">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Providers */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Top Providers</h2>
          <div className="space-y-3">
            {topProviders.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">${p.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500">{p.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  a.type === 'booking' ? 'bg-blue-500' : a.type === 'payment' ? 'bg-green-500'
                  : a.type === 'review' ? 'bg-yellow-500' : a.type === 'signup' ? 'bg-purple-500' : 'bg-orange-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{a.action}</p>
                  <p className="text-xs text-gray-400 truncate">{a.detail}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
