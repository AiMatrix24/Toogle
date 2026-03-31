import { Link } from 'react-router-dom'
import { Zap, MapPin, Shield, Star, Clock, Users, ArrowRight, CheckCircle, MessageSquare, CreditCard, Smartphone, Award } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Real-Time Availability', desc: 'See which providers are available right now, not just during business hours. One-tap toggle updates instantly.' },
  { icon: MapPin, title: 'AI Geolocation Matching', desc: 'Find the closest available providers with distance-based ranking and live map view.' },
  { icon: Shield, title: 'Verified & Trusted', desc: 'Every provider passes ID verification, background checks, and license validation. Trust scores you can rely on.' },
  { icon: Clock, title: '6-Stage Live Tracking', desc: 'Track your service from confirmed to en-route to arrived to completed. Real-time status at every step.' },
  { icon: CreditCard, title: 'Samiteon Payments', desc: 'Secure payments with blockchain-verified QR code receipts. Every transaction recorded for transparency.' },
  { icon: MessageSquare, title: 'Instant Messaging', desc: 'Chat directly with your provider. Typing indicators, read receipts, and photo sharing built in.' },
]

const stats = [
  { value: '200+', label: 'Service Providers' },
  { value: '<2 min', label: 'Avg. Time to Book' },
  { value: '4.8', label: 'Avg. Provider Rating' },
  { value: '12', label: 'Service Categories' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Homeowner', text: 'Found a plumber in 90 seconds on a Saturday night. Marcus arrived in 22 minutes and fixed our leak. This is the future.', rating: 5 },
  { name: "Mike's Plumbing Pro", role: 'Service Provider', text: "Toggle doubled my bookings. The availability toggle means I only get calls when I'm actually ready to work. No more missed leads.", rating: 5 },
  { name: 'Jessica W.', role: 'Property Manager', text: 'I manage 40 units. Toggle lets me book services for tenants instantly. The delegated booking feature is a game-changer.', rating: 5 },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-dark via-brand-800 to-brand-600 text-white px-4 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 text-sm">
            <Zap size={14} className="text-yellow-300" />
            <span>Real-time service availability marketplace</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Find Available Experts.<br />
            <span className="text-yellow-300">Right Now.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Toggle connects you with verified, available service professionals near you in real-time. No callbacks. No voicemails. Just instant access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-xl text-lg flex items-center justify-center gap-2">
              Find Services Now <ArrowRight size={20} />
            </Link>
            <Link to="/signup" className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-lg">
              Join as Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-brand-600">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Use Case Story */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Saturday night, 8:07 PM. Your kitchen sink backs up. You need help now — not Monday morning.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Open Toggle', desc: 'AI geofencing instantly identifies available providers within your service radius.', icon: Smartphone },
              { step: '2', title: 'Get Matched', desc: 'Our 7-factor matching engine ranks providers by ETA, rating, specialization, and trust score.', icon: Users },
              { step: '3', title: 'Book & Track', desc: 'Book in one tap. Track 6 stages from confirmed to completed. Pay securely with blockchain verification.', icon: CheckCircle },
            ].map(s => (
              <div key={s.step} className="card p-8 text-center">
                <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <s.icon size={28} className="text-brand-600" />
                </div>
                <div className="text-xs font-bold text-brand-600 mb-2">STEP {s.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built Different</h2>
            <p className="text-gray-600">Every feature designed for speed, trust, and real-time access.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={24} className="text-brand-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Real People</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} className={i <= t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 italic leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Providers CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <Award size={40} className="mx-auto text-brand-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Providers: Grow Your Business</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Toggle your availability, get matched with nearby customers, manage bookings, track earnings, and build your reputation — all from one dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['One-tap availability', 'Earnings dashboard', 'Blog & media', 'Deals engine', 'Review responses', 'Verified badges'].map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-2 rounded-full">
                <CheckCircle size={14} /> {f}
              </span>
            ))}
          </div>
          <Link to="/signup" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Join Toggle Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="font-bold text-lg">Toggle</span>
              </div>
              <p className="text-sm text-white/60">Tap Open Gigs.<br />Get Live Experts.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Platform</h4>
              <div className="space-y-2 text-sm text-white/60">
                <Link to="/" className="block hover:text-white">Find Services</Link>
                <Link to="/map" className="block hover:text-white">Map View</Link>
                <Link to="/deals" className="block hover:text-white">Deals</Link>
                <Link to="/emergency" className="block hover:text-white">Emergency</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <div className="space-y-2 text-sm text-white/60">
                <Link to="/about" className="block hover:text-white">About</Link>
                <Link to="/support" className="block hover:text-white">Support</Link>
                <Link to="/reviews" className="block hover:text-white">Reviews</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <div className="space-y-2 text-sm text-white/60">
                <Link to="/legal" className="block hover:text-white">Terms of Service</Link>
                <Link to="/legal" className="block hover:text-white">Privacy Policy</Link>
                <Link to="/legal" className="block hover:text-white">Provider Agreement</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-white/40">
            <p>2026 Toggle. All rights reserved. TOGGLE = Tap Open Gigs, Get Live Experts.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
