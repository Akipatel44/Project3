import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home as HomeIcon, MapPin, Calendar, Image } from 'lucide-react'
import './index.css'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="container-max flex justify-between items-center h-16">
            <motion.h1 
              className="text-2xl font-bold text-primary-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              OsamVista
            </motion.h1>
            <div className="flex gap-4">
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
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
