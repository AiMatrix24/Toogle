import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Star, Calendar, DollarSign, Clock, Settings, LogOut, Edit3, Shield } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { payments as paymentsApi, bookings as bookingsApi, notifications as notificationsApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { users as usersApi } from '../lib/api'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('history')
  const [profileData, setProfileData] = useState(null)

  const [paymentHistory, setPaymentHistory] = useState([])
  const [notifPrefs, setNotifPrefs] = useState({ email: true, sms: true, push: true, marketing: false })
  const [serviceHistory, setServiceHistory] = useState([])

  const loadBookings = () => {
    bookingsApi.list().then(data => {
      setServiceHistory(data.map(b => ({
        id: b.id,
        service: b.service,
        provider: b.provider,
        providerId: b.providerId,
        date: b.date,
        amount: b.amount || 0,
        status: b.status,
        rating: b.status === 'completed' ? 5 : null,
      })))
    }).catch(() => {})
  }

  useEffect(() => {
    if (user) {
      usersApi.profile().then(setProfileData).catch(() => {})
      loadBookings()
      notificationsApi.getPreferences().then(setNotifPrefs).catch(() => {})
      paymentsApi.list().then(data => {
        setPaymentHistory(data.map(p => ({
          id: p.transaction_id || p.id,
          provider: p.provider_name || 'Provider',
          service: 'Service',
          amount: p.amount,
          date: p.created_at?.split('T')[0] || '',
          status: p.status,
        })))
      }).catch(() => {})
    }
  }, [user])

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    try {
      await bookingsApi.updateStatus(bookingId, 'cancelled')
      loadBookings()
    } catch (err) {
      alert('Cancel failed: ' + err.message)
    }
  }

  const onLogout = async () => {
    await logout()
    navigate('/login')
  }

  const mockUser = {
    name: profileData?.name || user?.name || 'John Doe',
    email: profileData?.email || user?.email || 'john@email.com',
    phone: profileData?.phone || '(555) 123-4567',
    address: profileData?.address ? `${profileData.address}, ${profileData.city || ''}, ${profileData.state || ''} ${profileData.zip || ''}` : '456 Oak Ave, Los Angeles, CA 90012',
    memberSince: profileData?.memberSince || 'January 2026',
    totalBookings: profileData?.totalBookings || 12,
    totalSpent: profileData?.totalSpent || 1845,
    savedProviders: profileData?.savedProviders || 5,
    samiteonConnected: true,
    samiteonLast4: '8842'
  }

  // serviceHistory loaded from API via loadBookings()

  const tabs = [
    { id: 'history', label: 'Service History' },
    { id: 'payment', label: 'Payment Methods' },
    { id: 'settings', label: 'Account Settings' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-bold text-3xl shrink-0">
            {mockUser.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{mockUser.name}</h1>
              <button className="p-1.5 rounded-lg hover:bg-gray-100"><Edit3 size={16} className="text-gray-400" /></button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1"><Mail size={14} />{mockUser.email}</span>
              <span className="flex items-center gap-1"><Phone size={14} />{mockUser.phone}</span>
              <span className="flex items-center gap-1"><MapPin size={14} />{mockUser.address}</span>
              <span className="flex items-center gap-1"><Calendar size={14} />Member since {mockUser.memberSince}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Bookings', value: mockUser.totalBookings, color: 'bg-blue-50 text-blue-700' },
                { label: 'Total Spent', value: `$${mockUser.totalSpent}`, color: 'bg-green-50 text-green-700' },
                { label: 'Saved Providers', value: mockUser.savedProviders, color: 'bg-purple-50 text-purple-700' },
                { label: 'Avg Rating Given', value: '4.8', color: 'bg-yellow-50 text-yellow-700' },
              ].map(s => (
                <div key={s.label} className={`p-3 rounded-xl ${s.color}`}>
                  <p className="text-xs font-medium opacity-70">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === t.id ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Service History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {serviceHistory.map(s => (
            <div key={s.id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{s.service}</h3>
                  <p className="text-sm text-gray-500">{s.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    s.status === 'completed' ? 'bg-green-100 text-green-700'
                    : s.status === 'cancelled' ? 'bg-red-100 text-red-700'
                    : s.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                  }`}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                  {(s.status === 'pending' || s.status === 'confirmed') && (
                    <button onClick={() => handleCancelBooking(s.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={14} />{s.date}</span>
                  <span className="flex items-center gap-1"><DollarSign size={14} />${s.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  {s.rating ? (
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={12} className={i <= s.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  ) : (
                    <Link to="/review" className="text-brand-600 font-medium text-sm hover:text-brand-700">Leave Review</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Methods */}
      {activeTab === 'payment' && (
        <div className="space-y-4">
          <div className="card p-6 bg-gradient-to-br from-samiteon-500 to-samiteon-700 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Samiteon Charge Card</h3>
              <Shield size={24} className="text-white/60" />
            </div>
            <p className="text-white/60 text-sm mb-1">Card Number</p>
            <p className="text-xl font-mono tracking-wider mb-4">**** **** **** {mockUser.samiteonLast4}</p>
            <div className="flex justify-between">
              <div>
                <p className="text-white/60 text-xs">Card Holder</p>
                <p className="font-medium">{mockUser.name}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Status</p>
                <p className="font-medium text-green-300">Connected</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Payment History</h3>
            <div className="space-y-3">
              {paymentHistory.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">{c.service}</p>
                    <p className="text-xs text-gray-400">{c.provider} &middot; {c.date}</p>
                  </div>
                  <span className="font-semibold">${c.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Account Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings size={18} /> Account Settings
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Full Name', value: mockUser.name, type: 'text' },
                { label: 'Email', value: mockUser.email, type: 'email' },
                { label: 'Phone', value: mockUser.phone, type: 'tel' },
                { label: 'Address', value: mockUser.address, type: 'text' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                  <input type={f.type} defaultValue={f.value} className="input-field" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button className="btn-primary">Save Changes</button>
                <button className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Notification Preferences</h3>
            {[
              { key: 'email', label: 'Email notifications' },
              { key: 'sms', label: 'SMS notifications' },
              { key: 'push', label: 'Push notifications' },
              { key: 'marketing', label: 'Marketing emails' },
            ].map(pref => (
              <label key={pref.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 cursor-pointer">
                <span className="text-sm text-gray-700">{pref.label}</span>
                <div onClick={() => {
                  const updated = { ...notifPrefs, [pref.key]: !notifPrefs[pref.key] }
                  setNotifPrefs(updated)
                  notificationsApi.updatePreferences(updated).catch(() => {})
                }}
                  className={`toggle-track w-12 h-6 ${notifPrefs[pref.key] ? 'bg-accent-500' : 'bg-gray-300'}`}>
                  <div className={`toggle-thumb w-5 h-5 ${notifPrefs[pref.key] ? 'translate-x-5' : ''}`} />
                </div>
              </label>
            ))}
          </div>

          <button onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
