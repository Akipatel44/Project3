import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { useState } from 'react'

/**
 * Header Component
 * Global header with navigation
 * Used across all pages
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container-max flex justify-between items-center h-16">
        <h1 className="text-2xl font-bold text-primary-600">OsamVista</h1>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
        >
          <Menu size={24} />
        </button>
      </div>
    </motion.header>
  )
}
