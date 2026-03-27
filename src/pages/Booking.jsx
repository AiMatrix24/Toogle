import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
]

function generateDays() {
  const days = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      date: d,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      num: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      full: d.toISOString().split('T')[0],
      available: Math.random() > 0.2
    })
  }
  return days
}

export default function Booking({ providers }) {
  const { providerId } = useParams()
  const navigate = useNavigate()
  const provider = providers?.find(p => p.id === parseInt(providerId)) || providers?.[0]
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedService, setSelectedService] = useState('')
  const [notes, setNotes] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [days] = useState(generateDays)

  if (!provider) return null

  const handleConfirm = () => {
    setConfirmed(true)
  }

  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card p-8">
          <CheckCircle size={64} className="mx-auto text-accent-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6">Your appointment has been scheduled</p>
          <div className="bg-gray-50 rounded-2xl p-5 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Provider</span><span className="font-medium">{provider.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{selectedService}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{selectedDate}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selectedTime}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Est. Cost</span><span className="font-medium">${provider.hourlyRate}/hr</span></div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to={`/checkout/${provider.id}`} className="btn-samiteon">Pay with Samiteon</Link>
            <Link to="/" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
      <p className="text-gray-500 mb-6">Schedule a service with {provider.name}</p>

      {/* Provider Info */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
            {provider.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{provider.name}</h3>
            <p className="text-sm text-gray-500">{provider.category} &middot; ${provider.hourlyRate}/hr</p>
          </div>
          {provider.available && <span className="badge-available"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Available</span>}
        </div>
      </div>

      {/* Select Service */}
      <div className="card p-6 mb-4">
        <h2 className="font-bold text-gray-900 mb-3">1. Select Service</h2>
        <div className="grid grid-cols-2 gap-2">
          {provider.services.map(s => (
            <button key={s} onClick={() => setSelectedService(s)}
              className={`p-3 rounded-xl text-sm font-medium text-left transition-colors ${
                selectedService === s ? 'bg-brand-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Select Date */}
      <div className="card p-6 mb-4">
        <h2 className="font-bold text-gray-900 mb-3">2. Select Date</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map(d => (
            <button key={d.full} onClick={() => d.available && setSelectedDate(d.full)}
              disabled={!d.available}
              className={`flex flex-col items-center px-4 py-3 rounded-xl min-w-[70px] text-sm transition-colors ${
                selectedDate === d.full ? 'bg-brand-600 text-white'
                : d.available ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}>
              <span className="text-xs font-medium opacity-70">{d.day}</span>
              <span className="text-lg font-bold">{d.num}</span>
              <span className="text-xs opacity-70">{d.month}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Select Time */}
      <div className="card p-6 mb-4">
        <h2 className="font-bold text-gray-900 mb-3">3. Select Time</h2>
        <div className="grid grid-cols-5 gap-2">
          {timeSlots.map(t => (
            <button key={t} onClick={() => setSelectedTime(t)}
              className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                selectedTime === t ? 'bg-brand-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">4. Additional Notes</h2>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe your issue or any special instructions..."
          className="input-field h-24 resize-none" />
      </div>

      {/* Confirm */}
      <button onClick={handleConfirm}
        disabled={!selectedService || !selectedDate || !selectedTime}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
          selectedService && selectedDate && selectedTime
            ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}>
        <Calendar size={20} /> Confirm Booking
      </button>
    </div>
  )
}
