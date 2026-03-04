import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PlaceCard from '@/components/ui/PlaceCard'
import { Search, X, Loader } from 'lucide-react'
import { placesAPI } from '@/services/api'
import { resolveImageUrl, getDefaultCardImage } from '@/utils/imageUtils'

/**
 * Places Page
 * Display all sacred places with filtering
 */
export default function Places() {
  const [places, setPlaces] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch places from API
  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch from API
      const response = await placesAPI.getAll()
      const rawPlaces = response.data?.places || response.data || []
      const data = rawPlaces.map((place, index) => ({
        ...place,
        category: place.category || place.place_type || 'Temple',
        location: place.location || place.address || '',
        image:
          resolveImageUrl(
            buildImageUrl(place.image_url) || place.image || place.imageUrl || place.cover_image || place.banner_url
          ) || getDefaultCardImage(index),
      }))

      setPlaces(data)

      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map(place => place.category).filter(Boolean))]
      setCategories(uniqueCategories)
      
      setFilteredPlaces(data)
    } catch (err) {
      console.error('Error fetching places:', err)
      setError('Failed to load places. Please try again later.')
      // Fallback mock data
      setPlaces(getMockPlaces())
      setCategories(['All', 'Temple', 'Monument', 'Natural', 'Cultural'])
      setFilteredPlaces(getMockPlaces())
    } finally {
      setLoading(false)
    }
  }

  // Build full image URL from backend path
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return null
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    // Convert /images/filename.jpg to http://localhost:8000/images/filename.jpg
    if (imagePath.startsWith('/images/')) {
      return `http://localhost:8000${imagePath}`
    }
    
    return imagePath
  }

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
    applyFilters(category, searchTerm)
  }

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term)
    applyFilters(selectedCategory, term)
  }

  // Apply both filters
  const applyFilters = (category, search) => {
    let filtered = places

    // Category filter
    if (category !== 'All') {
      filtered = filtered.filter(place => place.category === category)
    }

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase()
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(term) ||
        place.description.toLowerCase().includes(term) ||
        (place.location && place.location.toLowerCase().includes(term))
      )
    }

    setFilteredPlaces(filtered)
  }

  // Clear filters
  const clearFilters = () => {
    setSelectedCategory('All')
    setSearchTerm('')
    setFilteredPlaces(places)
  }

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="w-full">
        {/* Header Section */}
        <motion.section
          className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.span className="text-primary-100 font-semibold text-sm uppercase" variants={itemVariants}>
                Explore Our Collection
              </motion.span>
              <motion.h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-4" variants={itemVariants}>
                Sacred Places
              </motion.h1>
              <motion.p className="text-lg text-primary-100 max-w-2xl" variants={itemVariants}>
                Discover the spiritual and cultural heritage of Osam Hill. Browse our curated collection of temples, 
                monuments, and sacred destinations.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* Filters Section */}
        <motion.section
          className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search places by name, location..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Filter Status & Clear Button */}
            {(selectedCategory !== 'All' || searchTerm) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">
                  Showing {filteredPlaces.length} of {places.length} places
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
                >
                  <X size={16} />
                  Clear Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Content Section */}
        <motion.section
          className="py-16 bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader size={48} className="text-primary-600" />
                </motion.div>
                <p className="text-gray-600 mt-4 font-semibold">Loading sacred places...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
              >
                <p className="text-red-700 font-semibold mb-3">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchPlaces}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredPlaces.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-gray-600 text-lg font-semibold mb-4">
                  No places found matching your criteria
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View All Places
                </motion.button>
              </motion.div>
            )}

            {/* Places Grid */}
            {!loading && !error && filteredPlaces.length > 0 && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredPlaces.map((place, index) => (
                  <PlaceCard
                    key={place.id || index}
                    place={place}
                    index={index}
                    onViewDetails={(place) => {
                      console.log('View details for:', place)
                      // TODO: Navigate to place detail page
                    }}
                  />
                ))}
              </motion.div>
            )}

            {/* Result Count */}
            {!loading && !error && filteredPlaces.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-12"
              >
                <p className="text-gray-600 font-semibold">
                  Showing {filteredPlaces.length} of {places.length} sacred places
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>
      </div>
  )
}

// Mock data for fallback
function getMockPlaces() {
  return [
    {
      id: 1,
      name: 'Osam Hill Temple',
      description: 'Ancient temple perched on the hilltop with stunning architectural design.',
      category: 'Temple',
      location: 'Osam Hill, Gujarat',
      image: '/src/assets/images/osam-hill-temple.jpg',
      rating: 4.8,
      visitingHours: '6 AM - 8 PM',
      visitors: '5000+',
    },
    {
      id: 2,
      name: 'Dwarka Temple Gates',
      description: 'Magnificent temple gates dedicated to Lord Krishna.',
      category: 'Temple',
      location: 'Dwarka, Gujarat',
      image: '/src/assets/images/dwarka-temple-gates.jpg',
      rating: 4.6,
      visitingHours: '5 AM - 9 PM',
      visitors: '4500+',
    },
    {
      id: 3,
      name: 'Modhera Sun Temple',
      description: 'Historical sun temple with intricate architectural elements.',
      category: 'Monument',
      location: 'Modhera, Gujarat',
      image: '/src/assets/images/modhera-temple.jpg',
      rating: 4.5,
      visitingHours: '8 AM - 6 PM',
      visitors: '3000+',
    },
    {
      id: 4,
      name: 'Osam Hill Stairs',
      description: 'Historic stone stairs climbing the sacred hill.',
      category: 'Natural',
      location: 'Osam Hill, Gujarat',
      image: '/src/assets/images/osam-stairs.jpg',
      rating: 4.7,
      visitingHours: '7 AM - 5 PM',
      visitors: '2500+',
    },
    {
      id: 5,
      name: 'Kutch Heritage & Crafts',
      description: 'Modern facility showcasing traditional arts and crafts.',
      category: 'Cultural',
      location: 'Kutch, Gujarat',
      image: '/src/assets/images/kutch-kraft.jpg',
      rating: 4.4,
      visitingHours: '9 AM - 7 PM',
      visitors: '2000+',
    },
    {
      id: 6,
      name: 'Somnath Temple',
      description: 'Ancient temple perfect for spiritual practices and pilgrimage.',
      category: 'Temple',
      location: 'Somnath, Gujarat',
      image: '/src/assets/images/somnath-temple.png',
      rating: 4.9,
      visitingHours: '6 AM - 8 PM',
      visitors: '1500+',
    },
  ]
}
