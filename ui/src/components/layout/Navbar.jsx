import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  MapPin,
  Calendar,
  Image,
  BarChart3,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/context'
import { getMenuByRole } from '@/config/menuConfig'
import logo from '@/assets/images/osamvista-logo.svg'

/**
 * Navbar Component
 * Role-based navigation with responsive mobile menu
 * Shows different menu items based on user role (SUPER_ADMIN, SUB_ADMIN, USER, PUBLIC)
 */
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Get menu items based on user role
  const menuItems = getMenuByRole(user?.role)

  // Icon mapping
  const iconMap = {
    Home: Home,
    MapPin: MapPin,
    Calendar: Calendar,
    Image: Image,
    BarChart3: BarChart3,
    Users: Users,
    Settings: Settings,
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsUserMenuOpen(false)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  }

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.2 },
    }),
  }

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={logo}
              alt="OsamVista"
              className="h-9 w-auto max-w-[160px] object-contain"
            />
          </motion.button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const IconComponent = iconMap[item.icon]
              const active = isActive(item.path)

              return (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    active
                      ? 'bg-emerald-100 text-emerald-700 font-semibold shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconComponent size={18} />
                  <span className="text-sm">{item.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              // User Logged In
              <div className="relative hidden sm:block">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name || 'User'}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-green-600 font-semibold mt-1">{user.role}</p>
                      </div>

                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        👤 My Profile
                      </button>

                      <button
                        onClick={() => navigate('/settings')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        ⚙️ Settings
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition font-medium flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // User Not Logged In
              <div className="hidden sm:flex items-center gap-2">
                <motion.button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-green-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn size={18} />
                  <span className="text-sm">Login</span>
                </motion.button>
                <motion.button
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserPlus size={18} />
                  <span className="text-sm">Register</span>
                </motion.button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-gray-50 border-t border-gray-200"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-4 py-3 space-y-1">
                {menuItems.map((item, i) => {
                  const IconComponent = iconMap[item.icon]
                  const active = isActive(item.path)

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                        active
                          ? 'bg-green-100 text-green-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <IconComponent size={20} />
                      <span>{item.label}</span>
                    </motion.button>
                  )
                })}

                {/* Mobile Auth Buttons */}
                {!user && (
                  <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
                    <motion.button
                      onClick={() => handleNavigation('/login')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                      variants={itemVariants}
                      custom={menuItems.length}
                      initial="hidden"
                      animate="visible"
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation('/register')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      variants={itemVariants}
                      custom={menuItems.length + 1}
                      initial="hidden"
                      animate="visible"
                    >
                      <UserPlus size={18} />
                      <span>Register</span>
                    </motion.button>
                  </div>
                )}

                {user && (
                  <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
                    <motion.button
                      onClick={() => {
                        handleNavigation('/profile')
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                      variants={itemVariants}
                      custom={menuItems.length}
                      initial="hidden"
                      animate="visible"
                    >
                      👤 <span>My Profile</span>
                    </motion.button>
                    <motion.button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                      variants={itemVariants}
                      custom={menuItems.length + 1}
                      initial="hidden"
                      animate="visible"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
