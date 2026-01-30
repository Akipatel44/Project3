import { Router, Routes, Route } from 'react-router-dom'
import './index.css'
import { Home, Login, Register, OTPVerify, Places, Events, Gallery } from './pages'
import Dashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminPlaces from './pages/admin/Places'
import AdminEvents from './pages/admin/Events'
import AdminGallery from './pages/admin/Gallery'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerify />} />
          <Route path="/places" element={<Places />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/places" element={<AdminPlaces />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
