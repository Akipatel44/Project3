import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home as HomeIcon, MapPin, Calendar, Image, LogOut, LogIn } from 'lucide-react'
import './index.css'
import { Home, Login, Register, OTPVerify, Places, Events, Gallery } from './pages'
import { useAuth } from './context'

function App() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Hide navigation on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        {!isAuthPage && (
          <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container-max flex justify-between items-center h-16">
              <motion.button
                onClick={() => navigate('/')}
                className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                OsamVista
              </motion.button>
              
              <div className="flex gap-6 items-center">
                <a href="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <HomeIcon size={20} />
                  <span>Home</span>
                </a>
                <a href="/places" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <MapPin size={20} />
                  <span>Places</span>
                </a>
                <a href="/events" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <Calendar size={20} />
                  <span>Events</span>
                </a>
                <a href="/gallery" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <Image size={20} />
                  <span>Gallery</span>
                </a>

                {/* Auth Buttons */}
                <div className="flex gap-3 items-center ml-4 pl-4 border-l border-gray-200">
                  {user ? (
                    <>
                      <span className="text-sm text-gray-700">Hi, {user.name || 'User'}</span>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      >
                        <LogOut size={18} />
                        <span className="text-sm">Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary-600 transition"
                      >
                        <LogIn size={18} />
                        <span className="text-sm">Login</span>
                      </button>
                      <button
                        onClick={() => navigate('/register')}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerify />} />
          <Route path="/places" element={<Places />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
