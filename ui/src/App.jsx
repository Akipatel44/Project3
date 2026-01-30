import { Router, Routes, Route } from 'react-router-dom'
import './index.css'
import { Home, Login, Register, OTPVerify, Places, Events, Gallery } from './pages'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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
