import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image, Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import { galleryAPI, getErrorMessage } from '@/services/api'

const AdminGallery = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch gallery items on mount
  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await galleryAPI.getAll()
      setItems(response.data || [])
      setFilteredItems(response.data || [])
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      console.error('Error fetching gallery:', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredItems(filtered)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      await galleryAPI.delete(id)
      setItems(items.filter(i => i.id !== id))
      setFilteredItems(filteredItems.filter(i => i.id !== id))
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gallery Management</h1>
            <p className="text-gray-400">Manage gallery photos and images</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} />
            Upload Images
          </motion.button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/20 border border-red-600/50 text-red-300 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search gallery items..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-3 border-purple-600 border-t-transparent rounded-full mx-auto"
            />
            <p className="text-gray-400 mt-4">Loading gallery...</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredItems.length > 0 && (
          <motion.div
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <table className="w-full">
              <thead className="bg-gray-700/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredItems.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    variants={itemVariants}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-gray-300">
                      <span className="bg-purple-900/30 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full">
                        {item.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-300">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded transition-colors"
                      >
                        <Eye size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 rounded transition-colors"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-400"
          >
            <p>No gallery items found</p>
          </motion.div>
        )}

        {/* Count */}
        {!loading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-sm">
            Showing {filteredItems.length} of {items.length} items
          </motion.p>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminGallery
