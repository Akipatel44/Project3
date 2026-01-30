import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import { placesAPI, getErrorMessage } from '@/services/api'

const AdminPlaces = () => {
  const [places, setPlaces] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch places on mount
  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await placesAPI.getAll()
      setPlaces(response.data || [])
      setFilteredPlaces(response.data || [])
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      console.error('Error fetching places:', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    const filtered = places.filter(
      place =>
        place.name.toLowerCase().includes(term.toLowerCase()) ||
        place.location?.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredPlaces(filtered)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this place?')) return

    try {
      await placesAPI.delete(id)
      setPlaces(places.filter(p => p.id !== id))
      setFilteredPlaces(filteredPlaces.filter(p => p.id !== id))
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
            <h1 className="text-3xl font-bold text-white mb-2">Places Management</h1>
            <p className="text-gray-400">Manage sacred places and locations</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} />
            Add Place
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
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-3 border-green-600 border-t-transparent rounded-full mx-auto"
            />
            <p className="text-gray-400 mt-4">Loading places...</p>
          </div>
        )}

        {/* Grid */}
        {!loading && filteredPlaces.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPlaces.map(place => (
              <motion.div
                key={place.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-green-600/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{place.name}</h3>
                    <p className="text-gray-400 text-sm">{place.location}</p>
                  </div>
                  <span className="bg-green-900/30 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                    {place.category || 'Uncategorized'}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-t border-gray-700">
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded bg-green-900/30 text-green-300">
                    Published
                  </span>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 py-2 rounded transition-colors"
                  >
                    <Eye size={16} />
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 py-2 rounded transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(place.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 py-2 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredPlaces.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-400"
          >
            <p>No places found</p>
          </motion.div>
        )}

        {/* Count */}
        {!loading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-sm">
            Showing {filteredPlaces.length} of {places.length} places
          </motion.p>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminPlaces
