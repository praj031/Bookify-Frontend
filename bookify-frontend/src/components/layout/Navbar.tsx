import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import {
  BookOpen,
  Library,
  Upload,
  Headphones,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useState } from 'react'

const navItems = [
  { label: 'My Library', path: '/dashboard', icon: Library },
  { label: 'Upload', path: '/upload', icon: Upload },
  { label: 'Marketplace', path: '/marketplace', icon: BookOpen },
  { label: 'Audio', path: '/audio', icon: Headphones },
  { label: 'Subscription', path: '/subscription', icon: CreditCard },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    showToast('You have been logged out', 'info')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-surface-0/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-surface-900">Bookify</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-surface-800 transition-colors"
          >
            <User className="h-4 w-4" />
            <span className="max-w-[140px] truncate">{user?.name || 'Profile'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-surface-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <button
            className="md:hidden rounded-lg p-2 text-surface-600 hover:bg-surface-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-200 bg-surface-0 px-4 py-3 animate-[slideUp_0.2s_ease-out]">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-surface-600 hover:bg-surface-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-600 hover:bg-surface-100"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false)
                handleLogout()
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
