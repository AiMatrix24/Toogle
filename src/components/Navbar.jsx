import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, Search, LayoutDashboard, MessageSquare, FileText, Calculator, Map, BarChart3, HelpCircle, LogIn, Award, Layers, Tag, Gift, AlertTriangle, DollarSign, Shield } from 'lucide-react'
import Notifications from './Notifications'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Find Services', icon: Search },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/emergency', label: 'Emergency', icon: AlertTriangle, highlight: true },
  { to: '/deals', label: 'Deals', icon: Tag, badge: 'NEW' },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/contracts', label: 'Contracts', icon: FileText },
  { to: '/quote', label: 'Quote', icon: Calculator },
  { to: '/reviews', label: 'Reviews', icon: Award },
  { to: '/blockchain', label: 'Blockchain', icon: Layers },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/support', label: 'Support', icon: HelpCircle },
]

export default function Navbar({ rewardsPoints }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const mobileMenuRef = useRef(null)

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none">
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Toggle - Home">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center" aria-hidden="true">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-brand-dark">Toggle</span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto" role="menubar" aria-label="Primary navigation">
            {navLinks.map(({ to, label, icon: Icon, highlight, badge }) => (
              <Link key={to} to={to} role="menuitem"
                aria-current={location.pathname === to ? 'page' : undefined}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 ${
                  location.pathname === to ? 'bg-brand-50 text-brand-700' :
                  highlight ? 'text-red-600 hover:bg-red-50' :
                  'text-gray-600 hover:bg-gray-100'
                }`}>
                <Icon size={14} aria-hidden="true" />
                {label}
                {badge && (
                  <span className="text-[9px] bg-accent-500 text-white px-1.5 py-0.5 rounded-full font-bold leading-none" aria-label={`${label} - ${badge}`}>{badge}</span>
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Admin Link */}
            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" aria-label="Admin Dashboard">
                <Shield size={14} className="text-red-600" aria-hidden="true" />
                <span className="text-xs font-bold text-red-700">Admin</span>
              </Link>
            )}
            {/* Rewards Points Badge */}
            {user && rewardsPoints > 0 && (
              <Link to="/rewards" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500" aria-label={`${rewardsPoints} rewards points`}>
                <Gift size={14} className="text-yellow-600" aria-hidden="true" />
                <span className="text-xs font-bold text-yellow-700">{rewardsPoints?.toLocaleString()}</span>
              </Link>
            )}
            <Notifications />
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500" aria-label={`Profile - ${user.name}`}>
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm" aria-hidden="true">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1">
                <LogIn size={16} aria-hidden="true" /> Sign In
              </Link>
            )}
            <button onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}>
              {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" ref={mobileMenuRef} className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4" role="menu" aria-label="Mobile navigation">
          {navLinks.map(({ to, label, icon: Icon, highlight, badge }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} role="menuitem"
              aria-current={location.pathname === to ? 'page' : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                location.pathname === to ? 'bg-brand-50 text-brand-700' :
                highlight ? 'text-red-600' : 'text-gray-600'
              }`}>
              <Icon size={18} aria-hidden="true" />
              {label}
              {badge && (
                <span className="text-[10px] bg-accent-500 text-white px-2 py-0.5 rounded-full font-bold" aria-label={badge}>{badge}</span>
              )}
            </Link>
          ))}
          <Link to="/rewards" onClick={() => setOpen(false)} role="menuitem"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <Gift size={18} aria-hidden="true" /> Rewards ({rewardsPoints?.toLocaleString()} pts)
          </Link>
          <Link to="/referrals" onClick={() => setOpen(false)} role="menuitem"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500">
            <DollarSign size={18} aria-hidden="true" /> Referrals
          </Link>
        </div>
      )}
    </nav>
  )
}
