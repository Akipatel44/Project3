import { motion } from 'framer-motion'
import logo from '@/assets/images/osamvista-logo.svg'

/**
 * Footer Component
 * Global footer displayed on all pages
 */
export default function Footer() {
  return (
    <motion.footer 
      className="bg-gray-900 text-white mt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container-max py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img src={logo} alt="OsamVista" className="h-9 w-auto max-w-[160px] object-contain mb-4" />
            <p className="text-gray-400">Exploring culture and heritage</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/" className="hover:text-white transition">Places</a></li>
              <li><a href="/" className="hover:text-white transition">Events</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Email: info@osamvista.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 OsamVista. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}
