import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCircle, Calendar, MessageSquare, Star, DollarSign, X, AlertCircle } from 'lucide-react'
import { notifications as notificationsApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const typeConfig = {
  booking: { icon: Calendar, color: 'bg-blue-100 text-blue-600' },
  message: { icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
  payment: { icon: DollarSign, color: 'bg-green-100 text-green-600' },
  review: { icon: Star, color: 'bg-yellow-100 text-yellow-600' },
  status: { icon: CheckCircle, color: 'bg-brand-100 text-brand-600' },
  system: { icon: AlertCircle, color: 'bg-gray-100 text-gray-600' },
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export default function Notifications() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef(null)

  // Fetch notifications
  const fetchNotifications = () => {
    if (!user) return
    notificationsApi.list()
      .then(data => {
        setItems(data)
        setUnreadCount(data.filter(n => !n.read).length)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [user])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = () => {
    notificationsApi.markAllRead().then(() => {
      setItems(prev => prev.map(n => ({ ...n, read: 1 })))
      setUnreadCount(0)
    }).catch(() => {})
  }

  const dismiss = (id) => {
    notificationsApi.markRead(id).then(() => {
      setItems(prev => prev.filter(n => n.id !== id))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }).catch(() => {})
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand-600 font-medium hover:text-brand-700">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              items.map(n => {
                const config = typeConfig[n.type] || typeConfig.system
                const Icon = config.icon
                return (
                  <div key={n.id}
                    className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      !n.read ? 'bg-blue-50/30' : ''
                    }`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">{n.title}</h4>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{timeAgo(n.created_at)}</span>
                    </div>
                    <button onClick={() => dismiss(n.id)}
                      className="p-1 rounded hover:bg-gray-200 shrink-0">
                      <X size={14} className="text-gray-400" />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          <div className="p-3 border-t border-gray-100 text-center">
            <button className="text-sm text-brand-600 font-medium hover:text-brand-700">View All Notifications</button>
          </div>
        </div>
      )}
    </div>
  )
}
