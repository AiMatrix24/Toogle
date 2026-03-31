import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { bookings as bookingsApi } from '../lib/api'

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
  const provider = providers?.find(p => p.id === providerId) || providers?.find(p => p.id === parseInt(providerId)) || providers?.[0]
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedService, setSelectedService] = useState('')
  const [notes, setNotes] = useState('')
  const [urgency, setUrgency] = useState('standard')
  const [propertyType, setPropertyType] = useState('')
  const [accessNotes, setAccessNotes] = useState('')
  const [issueDescription, setIssueDescription] = useState('')
  const [delegated, setDelegated] = useState(false)
  const [delegateInfo, setDelegateInfo] = useState({ name: '', phone: '', address: '' })
  const [confirmed, setConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [days] = useState(generateDays)

  if (!provider) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      const result = await bookingsApi.create({
        providerId: provider.id,
        serviceName: selectedService,
        date: selectedDate,
        startTime: selectedTime,
        notes,
        totalAmount: provider.hourlyRate,
      })
      setBookingId(result.id)
      setConfirmed(true)
    } catch (err) {
      alert('Booking failed: ' + (err.message || 'Please try again'))
    } finally {
      setSubmitting(false)
    }
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

      {/* Service Details Intake */}
      <div className="card p-6 mb-4">
        <h2 className="font-bold text-gray-900 mb-3">4. Service Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="urgency-select">Urgency Level</label>
            <select id="urgency-select" value={urgency} onChange={(e) => setUrgency(e.target.value)} className="input-field">
              <option value="standard">Standard (within a few days)</option>
              <option value="priority">Priority (same day / next day)</option>
              <option value="emergency">Emergency (ASAP - within hours)</option>
            </select>
            {urgency === 'emergency' && (
              <p className="text-xs text-red-600 mt-1">Emergency requests may include a 1.5x surge fee</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="property-type">Property Type</label>
            <select id="property-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="input-field">
              <option value="">Select property type</option>
              <option value="house">Single Family Home</option>
              <option value="apartment">Apartment / Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="commercial">Commercial / Office</option>
              <option value="mobile">Mobile Home</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="issue-desc">Describe the Issue</label>
            <textarea id="issue-desc" value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="What needs to be done? Include details about the problem, size of area, brand/model if applicable..."
              className="input-field h-24 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo of Issue (optional)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-300 transition-colors cursor-pointer">
              <p className="text-sm text-gray-500">Tap to upload a photo of the issue</p>
              <p className="text-xs text-gray-400 mt-1">Helps the provider prepare the right tools and materials</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="access-notes">Access Notes</label>
            <input id="access-notes" type="text" value={accessNotes} onChange={(e) => setAccessNotes(e.target.value)}
              placeholder="Gate code, parking instructions, pet warnings, etc."
              className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="add-notes">Additional Notes</label>
            <textarea id="add-notes" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other instructions for the provider..."
              className="input-field h-16 resize-none" />
          </div>
        </div>
      </div>

      {/* Delegated Booking */}
      <div className="card p-6 mb-6">
        <label className="flex items-center gap-3 cursor-pointer mb-3">
          <input type="checkbox" checked={delegated} onChange={(e) => setDelegated(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600" aria-label="Book for someone else" />
          <div>
            <span className="font-bold text-gray-900 text-sm">Book for someone else</span>
            <p className="text-xs text-gray-500">Booking on behalf of a family member, tenant, or client</p>
          </div>
        </label>
        {delegated && (
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <input type="text" value={delegateInfo.name}
              onChange={(e) => setDelegateInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Recipient's name" className="input-field text-sm" aria-label="Recipient name" />
            <input type="tel" value={delegateInfo.phone}
              onChange={(e) => setDelegateInfo(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Recipient's phone number" className="input-field text-sm" aria-label="Recipient phone" />
            <input type="text" value={delegateInfo.address}
              onChange={(e) => setDelegateInfo(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Service address (if different)" className="input-field text-sm" aria-label="Service address" />
          </div>
        )}
      </div>

      {/* Confirm */}
      <button onClick={handleConfirm}
        disabled={!selectedService || !selectedDate || !selectedTime || submitting}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
          selectedService && selectedDate && selectedTime && !submitting
            ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}>
        <Calendar size={20} /> {submitting ? 'Booking...' : 'Confirm Booking'}
      </button>
    </div>
  )
}
