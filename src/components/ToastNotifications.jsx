import { useState, useEffect, useCallback } from 'react'
import { X, MapPin, CheckCircle, MessageSquare, Star, DollarSign, Zap } from 'lucide-react'

const toastIcons = {
  availability: { icon: Zap, bg: 'bg-green-500', text: 'text-green-500' },
  booking: { icon: CheckCircle, bg: 'bg-blue-500', text: 'text-blue-500' },
  message: { icon: MessageSquare, bg: 'bg-purple-500', text: 'text-purple-500' },
  payment: { icon: DollarSign, bg: 'bg-samiteon-500', text: 'text-samiteon-500' },
  review: { icon: Star, bg: 'bg-yellow-500', text: 'text-yellow-500' },
  location: { icon: MapPin, bg: 'bg-brand-500', text: 'text-brand-500' },
}

export function useToasts() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration || 5000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

export function useAutoToasts(addToast, providers) {
  useEffect(() => {
    const messages = [
      { type: 'availability', title: 'Provider Now Available!', message: 'Pristine Clean Co. just came online near you', duration: 6000 },
      { type: 'location', title: 'New Provider Nearby', message: 'A highly-rated electrician is now available 0.5 mi away', duration: 6000 },
      { type: 'review', title: 'Trending Provider', message: "Mike's Plumbing Pro received 5 new 5-star reviews today", duration: 5000 },
      { type: 'availability', title: 'High Demand Alert', message: 'HVAC services are in high demand in your area right now', duration: 5000 },
    ]

    let idx = 0
    const interval = setInterval(() => {
      if (idx < messages.length) {
        addToast(messages[idx])
        idx++
      }
    }, 12000)

    // First toast after 8 seconds
    const initial = setTimeout(() => {
      addToast(messages[0])
      idx = 1
    }, 8000)

    return () => { clearInterval(interval); clearTimeout(initial) }
  }, [])
}

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 w-96 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast, i) => {
        const config = toastIcons[toast.type] || toastIcons.availability
        const Icon = config.icon
        return (
          <div key={toast.id}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3 animate-slide-in"
            style={{ animationDelay: `${i * 50}ms` }}>
            <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900">{toast.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{toast.message}</p>
              {toast.action && (
                <button onClick={toast.action.onClick}
                  className="text-xs text-brand-600 font-semibold mt-1 hover:text-brand-700">
                  {toast.action.label}
                </button>
              )}
            </div>
            <button onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-gray-100 shrink-0">
              <X size={14} className="text-gray-400" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
