import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import logo from '@/assets/images/osamvista-logo.svg'

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
        <img src={logo} alt="OsamVista" className="h-9 w-auto max-w-[160px] object-contain" />
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
