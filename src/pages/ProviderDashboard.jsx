import { useState, useEffect } from 'react'
import { Eye, Upload, FileText, Mic, Play, Image, PenLine, DollarSign, Calendar, TrendingUp, ArrowUp, Briefcase, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProviderCalendar from '../components/ProviderCalendar'
import { useAuth } from '../context/AuthContext'
import { providers as providersApi, analytics as analyticsApi, deals as dealsApi, bookings as bookingsApi } from '../lib/api'
import { reviews as reviewsApi } from '../lib/api'

export default function ProviderDashboard({ providers, toggleAvailability }) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('status')
  const [blogTitle, setBlogTitle] = useState('')
  const [blogContent, setBlogContent] = useState('')
  const [uploadType, setUploadType] = useState('video')
  const [dashboardData, setDashboardData] = useState(null)
  const [availabilityWindows, setAvailabilityWindows] = useState([
    { day: 'Monday', enabled: true, start: '08:00', end: '17:00' },
    { day: 'Tuesday', enabled: true, start: '08:00', end: '17:00' },
    { day: 'Wednesday', enabled: true, start: '08:00', end: '17:00' },
    { day: 'Thursday', enabled: true, start: '08:00', end: '17:00' },
    { day: 'Friday', enabled: true, start: '08:00', end: '17:00' },
    { day: 'Saturday', enabled: true, start: '09:00', end: '14:00' },
    { day: 'Sunday', enabled: false, start: '00:00', end: '00:00' },
  ])
  const [autoExpireMinutes, setAutoExpireMinutes] = useState(480)
  const [leadAppetite, setLeadAppetite] = useState({ minJobValue: 0, maxDistance: 25, urgencyOnly: false })
  const [earnings, setEarnings] = useState(null)
  const [myDeals, setMyDeals] = useState([])
  const [schedule, setSchedule] = useState([])

  // Find the logged-in provider from the providers list
  const myProvider = (user?.role === 'provider' && user?.providerId)
    ? providers.find(p => p.id === user.providerId) || providers[0]
    : providers[0]

  useEffect(() => {
    if (user?.role === 'provider') {
      providersApi.dashboard()
        .then(data => {
          setDashboardData(data)
          setSchedule(data.bookings || [])
          setMyDeals(data.deals || [])
        })
        .catch(() => {})
      analyticsApi.provider()
        .then(setEarnings)
        .catch(() => {})
    }
  }, [user])

  const tabs = [
    { id: 'status', label: 'Availability' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'media', label: 'Upload Media' },
    { id: 'blog', label: 'Write Blog' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'promotions', label: 'Promotions' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'services', label: 'My Services' },
  ]

  const [providerReviews, setProviderReviews] = useState([])
  const [responseText, setResponseText] = useState({})

  useEffect(() => {
    if (myProvider?.id) {
      reviewsApi.list(myProvider.id).then(setProviderReviews).catch(() => {})
    }
  }, [myProvider?.id])

  const handleRespondToReview = async (reviewId) => {
    const text = responseText[reviewId]
    if (!text) return
    try {
      await reviewsApi.respond(reviewId, text)
      setProviderReviews(prev => prev.map(r => r.id === reviewId ? { ...r, providerResponse: text } : r))
      setResponseText(prev => ({ ...prev, [reviewId]: '' }))
    } catch (err) {
      alert('Failed to respond: ' + err.message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500">Manage your availability, services, and content</p>
        </div>
        <Link to={`/provider/${myProvider.id}`} className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium">
          <Eye size={16} /> View My Page
        </Link>
      </div>

      {/* Availability Toggle */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Availability Status</h2>
            <p className="text-sm text-gray-500">Toggle your availability for customers to see in real-time</p>
          </div>
          <div className="flex items-center gap-4">
            {myProvider.available ? (
              <span className="badge-available text-base px-4 py-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                Available Now
              </span>
            ) : (
              <span className="badge-unavailable text-base px-4 py-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                Unavailable
              </span>
            )}
            <button onClick={() => toggleAvailability(myProvider.id)}
              className={`toggle-track w-16 h-8 ${myProvider.available ? 'bg-accent-500' : 'bg-gray-300'}`}>
              <div className={`toggle-thumb w-7 h-7 ${myProvider.available ? 'translate-x-8' : ''}`} />
            </button>
          </div>
        </div>

        {/* Per-Provider Toggles */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">All Provider Availability</h3>
          <div className="space-y-3">
            {providers.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                    p.available ? 'bg-brand-600' : 'bg-gray-400'
                  }`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-900">{p.name}</span>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${p.available ? 'text-green-600' : 'text-red-500'}`}>
                    {p.available ? 'ON' : 'OFF'}
                  </span>
                  <button onClick={() => toggleAvailability(p.id)}
                    className={`toggle-track w-12 h-6 ${p.available ? 'bg-accent-500' : 'bg-gray-300'}`}>
                    <div className={`toggle-thumb w-5 h-5 ${p.available ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === t.id ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'media' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Media Content</h2>
          <div className="flex gap-2 mb-6">
            {[
              { type: 'video', icon: Play, label: 'Video' },
              { type: 'podcast', icon: Mic, label: 'Podcast' },
              { type: 'audio', icon: Mic, label: 'Audio' },
              { type: 'image', icon: Image, label: 'Image' },
            ].map(({ type, icon: Icon, label }) => (
              <button key={type} onClick={() => setUploadType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  uploadType === type ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-brand-300 transition-colors cursor-pointer">
            <Upload size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">Drop your {uploadType} file here</h3>
            <p className="text-sm text-gray-400">or click to browse</p>
            <input type="file" className="hidden" />
          </div>
          <div className="mt-4">
            <input type="text" placeholder="Title for your media..." className="input-field mb-3" />
            <textarea placeholder="Description..." className="input-field h-24 resize-none" />
            <button className="btn-primary mt-4">
              <Upload size={16} className="inline mr-2" /> Upload {uploadType}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'blog' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PenLine size={18} /> Write a Blog Post
          </h2>
          <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)}
            placeholder="Blog post title..." className="input-field mb-4 text-lg font-semibold" />
          <textarea value={blogContent} onChange={(e) => setBlogContent(e.target.value)}
            placeholder="Write your blog post content here. Share tips, industry knowledge, or updates about your services..."
            className="input-field h-64 resize-none mb-4" />
          <div className="flex items-center gap-3">
            <button className="btn-primary">
              <FileText size={16} className="inline mr-2" /> Publish Post
            </button>
            <button className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">
              Save Draft
            </button>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Customer Reviews</h2>
            <p className="text-sm text-gray-500 mb-4">Respond to reviews to build trust and show customers you care.</p>
          </div>
          {providerReviews.length === 0 ? (
            <div className="card p-8 text-center text-gray-400">No reviews yet</div>
          ) : providerReviews.map(r => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.customerName}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`text-xs ${i <= r.rating ? 'text-yellow-400' : 'text-gray-300'}`}>&#9733;</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{r.date?.split('T')[0]}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{r.text}</p>

              {r.providerResponse ? (
                <div className="bg-brand-50 rounded-xl p-3 border-l-4 border-brand-500">
                  <p className="text-xs font-medium text-brand-700 mb-1">Your Response</p>
                  <p className="text-sm text-brand-800">{r.providerResponse}</p>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-100">
                  <textarea
                    value={responseText[r.id] || ''}
                    onChange={(e) => setResponseText(prev => ({ ...prev, [r.id]: e.target.value }))}
                    placeholder="Write your response to this review..."
                    className="input-field text-sm h-16 resize-none mb-2"
                    aria-label={`Respond to ${r.customerName}'s review`} />
                  <button onClick={() => handleRespondToReview(r.id)}
                    disabled={!responseText[r.id]?.trim()}
                    className="btn-primary text-sm py-2 px-4 disabled:opacity-50">
                    Post Response
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Services</h2>
          <div className="space-y-3 mb-6">
            {myProvider.services.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-800">{s}</span>
                <span className="text-sm text-gray-500">${myProvider.hourlyRate}/hr</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input type="text" placeholder="Add a new service..." className="input-field flex-1" />
            <button className="btn-primary">Add Service</button>
          </div>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Reviews', value: myProvider.reviewCount, color: 'bg-blue-50 text-blue-700' },
              { label: 'Rating', value: myProvider.rating, color: 'bg-yellow-50 text-yellow-700' },
              { label: 'Hourly Rate', value: `$${myProvider.hourlyRate}`, color: 'bg-green-50 text-green-700' },
              { label: 'Response Time', value: myProvider.responseTime, color: 'bg-purple-50 text-purple-700' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`p-4 rounded-xl ${color}`}>
                <p className="text-xs font-medium opacity-70">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Scheduled Availability Windows */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Scheduled Availability Windows</h3>
            <p className="text-sm text-gray-500 mb-4">Set your recurring weekly availability. Customers can only book during these windows.</p>
            <div className="space-y-2">
              {availabilityWindows.map((w, i) => (
                <div key={w.day} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div
                    onClick={() => setAvailabilityWindows(prev => prev.map((win, idx) => idx === i ? { ...win, enabled: !win.enabled } : win))}
                    className={`toggle-track w-10 h-5 ${w.enabled ? 'bg-accent-500' : 'bg-gray-300'}`}
                    role="switch" aria-checked={w.enabled} aria-label={`${w.day} availability`} tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setAvailabilityWindows(prev => prev.map((win, idx) => idx === i ? { ...win, enabled: !win.enabled } : win))}>
                    <div className={`toggle-thumb w-4 h-4 ${w.enabled ? 'translate-x-4' : ''}`} />
                  </div>
                  <span className="w-24 text-sm font-medium text-gray-700">{w.day}</span>
                  {w.enabled ? (
                    <div className="flex items-center gap-2">
                      <input type="time" value={w.start}
                        onChange={(e) => setAvailabilityWindows(prev => prev.map((win, idx) => idx === i ? { ...win, start: e.target.value } : win))}
                        className="input-field text-sm py-1 px-2 w-28" aria-label={`${w.day} start time`} />
                      <span className="text-gray-400">to</span>
                      <input type="time" value={w.end}
                        onChange={(e) => setAvailabilityWindows(prev => prev.map((win, idx) => idx === i ? { ...win, end: e.target.value } : win))}
                        className="input-field text-sm py-1 px-2 w-28" aria-label={`${w.day} end time`} />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Closed</span>
                  )}
                </div>
              ))}
            </div>

            {/* Auto-Expire */}
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
              <label className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Auto-expire availability</p>
                  <p className="text-xs text-yellow-600">Automatically go offline after this many minutes of being toggled on</p>
                </div>
                <select value={autoExpireMinutes} onChange={(e) => setAutoExpireMinutes(parseInt(e.target.value))}
                  className="input-field text-sm py-1 px-3 w-32" aria-label="Auto-expire duration">
                  <option value={120}>2 hours</option>
                  <option value={240}>4 hours</option>
                  <option value={480}>8 hours</option>
                  <option value={720}>12 hours</option>
                  <option value={0}>Never</option>
                </select>
              </label>
            </div>

            {/* Lead Appetite Controls */}
            <div className="mt-4 p-4 bg-brand-50 rounded-xl">
              <h4 className="text-sm font-medium text-brand-800 mb-3">Lead Appetite Controls</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-brand-600 font-medium" htmlFor="min-job">Min Job Value ($)</label>
                  <input id="min-job" type="number" value={leadAppetite.minJobValue}
                    onChange={(e) => setLeadAppetite(prev => ({ ...prev, minJobValue: parseInt(e.target.value) || 0 }))}
                    className="input-field text-sm py-1.5 mt-1" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs text-brand-600 font-medium" htmlFor="max-distance">Max Distance (miles)</label>
                  <input id="max-distance" type="number" value={leadAppetite.maxDistance}
                    onChange={(e) => setLeadAppetite(prev => ({ ...prev, maxDistance: parseInt(e.target.value) || 25 }))}
                    className="input-field text-sm py-1.5 mt-1" placeholder="25" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={leadAppetite.urgencyOnly}
                      onChange={(e) => setLeadAppetite(prev => ({ ...prev, urgencyOnly: e.target.checked }))}
                      className="w-4 h-4 rounded" />
                    <span className="text-xs text-brand-700 font-medium">Urgent requests only</span>
                  </label>
                </div>
              </div>
            </div>

            <button className="btn-primary mt-4 w-full">Save Availability Settings</button>
          </div>
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'This Month', value: `$${(earnings?.monthlyRevenue?.[5] || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-700', change: '+12%' },
              { label: 'Total Jobs', value: earnings?.totalJobs || 0, icon: Briefcase, color: 'bg-blue-50 text-blue-700', change: '+8' },
              { label: 'Avg Job Value', value: `$${earnings?.avgJobValue || 0}`, icon: TrendingUp, color: 'bg-purple-50 text-purple-700', change: '+$5' },
              { label: 'Repeat Customers', value: `${earnings?.repeatCustomerRate || 0}%`, icon: ArrowUp, color: 'bg-yellow-50 text-yellow-700', change: '+3%' },
            ].map(({ label, value, icon: Icon, color, change }) => (
              <div key={label} className={`card p-5 ${color}`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} className="opacity-60" />
                  <span className="text-xs font-bold text-green-600">{change}</span>
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs font-medium opacity-70 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Monthly Revenue</h3>
            <div className="flex items-end gap-3 h-48">
              {(earnings?.monthlyRevenue || [3200, 4100, 3800, 4500, 5200, 4800]).map((rev, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-gray-600">${(rev/1000).toFixed(1)}k</span>
                  <div className="w-full bg-brand-500 rounded-t-lg transition-all hover:bg-brand-600"
                    style={{ height: `${(rev / 6000) * 100}%` }} />
                  <span className="text-xs text-gray-500">{(earnings?.monthLabels || ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'])[i]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-brand-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-brand-700">Projected Annual Revenue</span>
                <span className="text-xl font-bold text-brand-800">${Math.round((earnings?.monthlyRevenue || [3200, 4100, 3800, 4500, 5200, 4800]).reduce((a,b)=>a+b,0)/6*12).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Monthly Goal</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">${(earnings?.monthlyRevenue || [3200, 4100, 3800, 4500, 5200, 4800])[5].toLocaleString()} / $5,000</span>
              <span className="text-sm font-bold text-brand-600">{Math.round((earnings?.monthlyRevenue || [3200, 4100, 3800, 4500, 5200, 4800])[5]/5000*100)}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all"
                style={{ width: `${Math.min((earnings?.monthlyRevenue || [3200, 4100, 3800, 4500, 5200, 4800])[5]/5000*100, 100)}%` }} />
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Payout History</h3>
            <div className="space-y-3">
              {(earnings?.payouts || []).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.date}</p>
                    <p className="text-xs text-gray-400">{p.method}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">${p.amount}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <ProviderCalendar schedule={schedule} onStatusChange={async (bookingId, status) => {
          try {
            await bookingsApi.updateStatus(bookingId, status)
            // Refresh dashboard data
            const data = await providersApi.dashboard()
            setSchedule(data.bookings || [])
          } catch (err) {
            alert('Status update failed: ' + err.message)
          }
        }} />
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Work Portfolio</h2>
          <p className="text-sm text-gray-500 mb-6">Showcase your best work with before/after photos to build trust with potential customers.</p>
          {myProvider.portfolio && myProvider.portfolio.length > 0 && (
            <div className="mb-6">
              {myProvider.portfolio.map(item => (
                <div key={item.id} className="p-4 bg-gray-50 rounded-xl mb-3">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-lg mt-1 inline-block">{item.service}</span>
                </div>
              ))}
            </div>
          )}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
            <Upload size={32} className="mx-auto text-gray-300 mb-2" />
            <h3 className="font-semibold text-gray-700 mb-1">Add Before/After Photos</h3>
            <p className="text-sm text-gray-400">Upload photos of your completed work</p>
          </div>
        </div>
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag size={18} className="text-accent-500" /> Your Active Promotions
            </h2>
            {myDeals.length > 0 ? (
              <div className="space-y-3">
                {myDeals.map(deal => (
                  <div key={deal.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">{deal.title}</h3>
                      <p className="text-sm text-gray-500">{deal.percentOff}% off &middot; {deal.claimedCount}/{deal.maxClaims} claimed</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">${deal.dealPrice}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No active promotions</p>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Create New Promotion</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Promotion title..." className="input-field" />
              <textarea placeholder="Describe the deal..." className="input-field h-20 resize-none" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Discount %</label>
                  <input type="number" placeholder="25" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Max Claims</label>
                  <input type="number" placeholder="30" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
                  <input type="date" className="input-field" />
                </div>
              </div>
              <button className="btn-primary">Create Promotion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
