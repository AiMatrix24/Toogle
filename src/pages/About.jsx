import { Link } from 'react-router-dom'
import { Zap, Shield, MapPin, Clock, Star, Users, ArrowRight } from 'lucide-react'

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-6" aria-hidden="true">
          <span className="text-white font-bold text-4xl">T</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark mb-4">
          TOGGLE
        </h1>
        <p className="text-xl text-brand-600 font-semibold mb-4 italic">
          Tap Open Gigs. Get Live Experts.
        </p>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          The real-time service availability marketplace that makes finding available service professionals fast, simple, and trustworthy.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-600">
            To remove the friction between customer need and provider availability by creating a real-time connection point where open time, open talent, and open opportunity meet.
          </p>
        </div>
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h2>
          <p className="text-gray-600">
            To become the most trusted real-time service availability platform — the place people go first when they need to know who is ready now.
          </p>
        </div>
      </div>

      {/* What We Stand For */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What TOGGLE Stands For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Zap, title: 'Speed Without Confusion', desc: 'Respect the urgency of customer need and provider opportunity.' },
            { icon: MapPin, title: 'Access Without Guesswork', desc: 'Make every interaction easy to understand and easy to act on.' },
            { icon: Shield, title: 'Trust Without Shortcuts', desc: 'Build confidence through transparency, reliability, and accountability.' },
            { icon: Clock, title: 'Opportunity Without Wasted Time', desc: 'Help providers turn available time into meaningful growth.' },
            { icon: Users, title: 'Service Without Barriers', desc: 'Every connection represents a real person with a real need.' },
            { icon: Star, title: 'Quality Without Compromise', desc: 'Verified providers, blockchain contracts, and real-time tracking.' },
          ].map(v => (
            <div key={v.title} className="card p-6">
              <v.icon size={24} className="text-brand-600 mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900 mb-1">{v.title}</h3>
              <p className="text-sm text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {[
            { step: '1', title: 'Search', desc: 'Tell us what service you need. Our AI matches you with available providers nearby.' },
            { step: '2', title: 'Match', desc: 'See real-time availability, ratings, pricing, and estimated arrival times.' },
            { step: '3', title: 'Book', desc: 'Book instantly or request quotes. Track your provider from confirmed to completed.' },
          ].map(s => (
            <div key={s.step} className="flex-1 text-center">
              <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4" aria-hidden="true">
                {s.step}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-brand-600 to-brand-800 rounded-3xl p-10 text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
        <p className="text-white/80 mb-6">Find available service professionals in your area right now.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
            Find Services <ArrowRight size={16} />
          </Link>
          <Link to="/signup" className="border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
            Join as Provider
          </Link>
        </div>
      </div>
    </div>
  )
}
