import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Search, LayoutDashboard, MessageSquare, FileText, Calculator, Map, BarChart3, HelpCircle, User, LogIn } from 'lucide-react'
import Notifications from './Notifications'

const navLinks = [
  { to: '/', label: 'Find Services', icon: Search },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/contracts', label: 'Contracts', icon: FileText },
  { to: '/quote', label: 'Quote', icon: Calculator },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/support', label: 'Support', icon: HelpCircle },
]

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-brand-dark">Toogle</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Notifications />
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700">
                <LogIn size={16} /> Sign In
              </Link>
            )}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                location.pathname === to ? 'bg-brand-50 text-brand-700' : 'text-gray-600'
              }`}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
