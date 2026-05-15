import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, User, LogOut, LayoutDashboard, Package, Search } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useCartStore } from '../store/cart'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { count } = useCartStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const handleLogout = () => { logout(); navigate('/login') }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`)
      setSearchOpen(false)
      setSearchVal('')
    }
  }

  const isActive = (path: string) => location.pathname === path
  const isAdminUser = user?.role === 'ADMIN'
  const primaryBg = isAdminUser
    ? 'bg-gradient-to-r from-red-700 via-red-800 to-red-600 text-white shadow-red-900/20 border-b border-red-800'
    : 'bg-[#0f0e17] text-white'
  const activeBgClass = isAdminUser ? 'bg-red-600/95 text-white shadow-lg shadow-red-900/10' : 'bg-violet-600 text-white'
  const linkHoverClass = isAdminUser ? 'text-red-100 hover:bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'
  const iconClass = isAdminUser ? 'text-red-100 hover:text-white' : 'text-gray-400 hover:text-white'

  return (
    <header className={`${primaryBg} sticky top-0 z-50 w-full`}>
      <div className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="text-xl font-black tracking-tight shrink-0">
          Shop<span className={isAdminUser ? 'text-white' : 'text-violet-400'}>Nest</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[['/', 'Home'], ['/products', 'Products']].map(([path, label]) => (
            <Link key={path} to={path}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive(path) ? activeBgClass : linkHoverClass
              }`}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                autoFocus
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onBlur={() => { if (!searchVal) setSearchOpen(false) }}
                placeholder="Search..."
                className={`bg-white/10 text-white placeholder-gray-300 border border-white/20 rounded-full px-4 py-1.5 text-sm outline-none ${isAdminUser ? 'focus:border-red-400' : 'focus:border-violet-400'} w-48 transition-all`}
              />
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className={`p-2 ${iconClass} transition-colors ${isAdminUser ? 'hover:bg-red-600/20 rounded-full' : ''}`}>
              <Search size={19} />
            </button>
          )}

          {user ? (
            <>
              <Link to="/wishlist" className={`p-2 transition-colors ${iconClass}`} title="Wishlist">
                <Heart size={19} />
              </Link>

              <Link to="/cart" className={`relative p-2 transition-colors ${iconClass}`} title="Cart">
                <ShoppingCart size={19} />
                {count > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-violet-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>

              <Link to="/orders" className={`p-2 transition-colors ${iconClass}`} title="Orders">
                <Package size={19} />
              </Link>

              {user.role === 'ADMIN' && (
                <Link to="/admin" className={`p-2 transition-colors ${iconClass}`} title="Admin">
                  <LayoutDashboard size={19} />
                </Link>
              )}

              {/* Avatar dropdown trigger */}
              <Link to="/profile" className="flex items-center gap-2 ml-1 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-3 py-1.5">
                <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <span className="text-sm font-medium hidden md:block">{user.firstName}</span>
              </Link>

              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-bold bg-violet-600 hover:bg-violet-500 rounded-full transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
