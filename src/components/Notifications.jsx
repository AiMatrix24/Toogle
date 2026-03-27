import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCircle, Calendar, MessageSquare, Star, DollarSign, X } from 'lucide-react'

const mockNotifications = [
  { id: 1, type: 'booking', icon: Calendar, title: 'Booking Confirmed', message: 'Your appointment with Mike\'s Plumbing Pro is confirmed for tomorrow at 2 PM', time: '5 min ago', read: false },
  { id: 2, type: 'message', icon: MessageSquare, title: 'New Message', message: 'Spark Electric Solutions replied to your inquiry', time: '15 min ago', read: false },
  { id: 3, type: 'payment', icon: DollarSign, title: 'Payment Processed', message: 'Your Samiteon payment of $120 was successful', time: '1 hr ago', read: false },
  { id: 4, type: 'review', icon: Star, title: 'Review Reminder', message: 'How was your service with Pristine Clean Co.? Leave a review!', time: '3 hrs ago', read: true },
  { id: 5, type: 'status', icon: CheckCircle, title: 'Service Complete', message: 'Mike\'s Plumbing Pro marked your leak repair as complete', time: '1 day ago', read: true },
]

const typeColors = {
  booking: 'bg-blue-100 text-blue-600',
  message: 'bg-purple-100 text-purple-600',
  payment: 'bg-green-100 text-green-600',
  review: 'bg-yellow-100 text-yellow-600',
  status: 'bg-brand-100 text-brand-600',
}

export default function Notifications() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const ref = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id))

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
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map(n => {
                const Icon = n.icon
                return (
                  <div key={n.id}
                    className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      !n.read ? 'bg-blue-50/30' : ''
                    }`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeColors[n.type]}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">{n.title}</h4>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{n.time}</span>
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
