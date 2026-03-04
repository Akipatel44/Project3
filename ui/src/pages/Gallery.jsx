import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GalleryItem from '@/components/ui/GalleryItem'
import GalleryModal from '@/components/ui/GalleryModal'
import { Search, X, Loader } from 'lucide-react'
import { galleryAPI } from '@/services/api'
import { resolveImageUrl, getDefaultCardImage } from '@/utils/imageUtils'

/**
 * Gallery Page
 * Display photo gallery with masonry layout and modal preview
 */
export default function Gallery() {
  const [allItems, setAllItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Fetch gallery items from API
  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch from API
      const response = await galleryAPI.getAll()
      const rawItems = response.data?.gallery || response.data?.items || response.data || []
      const data = rawItems.map((item, index) => ({
        ...item,
        title: item.title || item.name || 'Untitled',
        category: item.category || item.type || 'General',
        image:
          resolveImageUrl(
            buildImageUrl(item.image_url) || item.image || item.imageUrl || item.url || item.file_url
          ) || getDefaultCardImage(index),
      }))

      setAllItems(data)
      setFilteredItems(data)

      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map(item => item.category).filter(Boolean))]
      setCategories(uniqueCategories)
    } catch (err) {
      console.error('Error fetching gallery items:', err)
      setError('Failed to load gallery. Please try again later.')
      // Fallback mock data
      const mockData = getMockGalleryItems()
      setAllItems(mockData)
      setFilteredItems(mockData)
      setCategories(['All', 'Temples', 'Festivals', 'Landscapes', 'Culture', 'Events'])
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
    let filtered = allItems

    // Category filter
    if (category !== 'All') {
      filtered = filtered.filter(item => item.category === category)
    }

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase()
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term))
      )
    }

    setFilteredItems(filtered)
  }

  // Clear filters
  const clearFilters = () => {
    setSelectedCategory('All')
    setSearchTerm('')
    setFilteredItems(allItems)
  }

  // Handle modal navigation
  const handleOpenModal = (item) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setTimeout(() => setSelectedItem(null), 300)
  }

  const handlePrevImage = () => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id)
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1])
    } else {
      setSelectedItem(filteredItems[filteredItems.length - 1])
    }
  }

  const handleNextImage = () => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id)
    if (currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1])
    } else {
      setSelectedItem(filteredItems[0])
    }
  }

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
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
          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.span className="text-purple-100 font-semibold text-sm uppercase" variants={itemVariants}>
                Visual Journey
              </motion.span>
              <motion.h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-4" variants={itemVariants}>
                Photo Gallery
              </motion.h1>
              <motion.p className="text-lg text-purple-100 max-w-2xl" variants={itemVariants}>
                Explore stunning photographs capturing the essence of Osam Hill. Browse our collection of temples, 
                festivals, landscapes, and cultural moments.
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
                  placeholder="Search photos by title or description..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              {categories.map(category => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white shadow-lg'
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
                  Showing {filteredItems.length} of {allItems.length} photos
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-32">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader size={48} className="text-purple-600" />
                </motion.div>
                <p className="text-gray-600 mt-4 font-semibold">Loading gallery...</p>
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
                  onClick={fetchGalleryItems}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-32"
              >
                <p className="text-gray-600 text-lg font-semibold mb-4">
                  No photos found matching your criteria
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View All Photos
                </motion.button>
              </motion.div>
            )}

            {/* Masonry Grid */}
            {!loading && !error && filteredItems.length > 0 && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    style={{
                      gridRow: item.gridRow && `span ${item.gridRow}`,
                    }}
                  >
                    <GalleryItem
                      item={item}
                      index={index}
                      onClick={handleOpenModal}
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Result Count */}
            {!loading && !error && filteredItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-12"
              >
                <p className="text-gray-600 font-semibold">
                  Showing {filteredItems.length} of {allItems.length} photos
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Gallery Modal */}
        {selectedItem && (
          <GalleryModal
            isOpen={modalOpen}
            item={selectedItem}
            items={filteredItems}
            currentIndex={filteredItems.findIndex(item => item.id === selectedItem.id)}
            onClose={handleCloseModal}
            onNext={handleNextImage}
            onPrev={handlePrevImage}
          />
        )}
      </div>
  )
}

// Mock data for fallback
function getMockGalleryItems() {
  return [
    {
      id: 1,
      title: 'Osam Hill Temple',
      description: 'Ancient temple architecture with spiritual significance.',
      category: 'Temples',
      image: '/src/assets/images/osam-hill-temple.jpg',
      photographer: 'John Doe',
      gridRow: 2,
    },
    {
      id: 2,
      title: 'Hill Flowers in Bloom',
      description: 'Vibrant flora blooming across the hill grounds.',
      category: 'Landscapes',
      image: '/src/assets/images/osam-hill-flowers.jpg',
      photographer: 'Sarah Smith',
      gridRow: 1,
    },
    {
      id: 3,
      title: 'Hill Landscape View',
      description: 'Serene natural landscape surrounded by greenery.',
      category: 'Landscapes',
      image: '/src/assets/images/osam-hill1.jpg',
      photographer: 'Mike Johnson',
      gridRow: 2,
    },
    {
      id: 4,
      title: 'Ancient Temple Stairs',
      description: 'Historic stone stairs climbing the sacred hill.',
      category: 'Temples',
      image: '/src/assets/images/osam-stairs.jpg',
      photographer: 'Emma Wilson',
      gridRow: 1,
    },
    {
      id: 5,
      title: 'Dwarka Temple Gates',
      description: 'Intricate details of temple architectural elements.',
      category: 'Temples',
      image: '/src/assets/images/dwarka-temple-gates.jpg',
      photographer: 'David Lee',
      gridRow: 2,
    },
    {
      id: 6,
      title: 'Modhera Sun Temple',
      description: 'Grand sun temple with intricate carvings.',
      category: 'Culture',
      image: '/src/assets/images/modhera-temple.jpg',
      photographer: 'Lisa Anderson',
      gridRow: 1,
    },
    {
      id: 7,
      title: 'Somnath Temple Grandeur',
      description: 'Panoramic view of the coastal temple complex.',
      category: 'Temples',
      image: '/src/assets/images/somnath-temple.png',
      photographer: 'Chris Martin',
      gridRow: 2,
    },
    {
      id: 8,
      title: 'Somnath Marathon Event',
      description: 'Community gathering and sporting event.',
      category: 'Events',
      image: '/src/assets/images/somnath-marathon.jpg',
      photographer: 'Anna Taylor',
      gridRow: 2,
    },
    {
      id: 9,
      title: 'Palitana Temples Complex',
      description: 'Ancient temple complex on sacred hilltop.',
      category: 'Temples',
      image: '/src/assets/images/palitana-temples.jpg',
      photographer: 'Robert Brown',
      gridRow: 1,
    },
    {
      id: 10,
      title: 'Dwarka Heritage Site',
      description: 'Historic pilgrimage destination with cultural significance.',
      category: 'Culture',
      image: '/src/assets/images/dwarka.jpg',
      photographer: 'Jennifer White',
      gridRow: 1,
    },
    {
      id: 11,
      title: 'Kutch Craft Heritage',
      description: 'Traditional craftsmanship and cultural heritage.',
      category: 'Culture',
      image: '/src/assets/images/kutch-kraft.jpg',
      photographer: 'Mark Davis',
      gridRow: 1,
    },
    {
      id: 12,
      title: 'Gir Forest Wildlife',
      description: 'Exotic wildlife in natural habitat.',
      category: 'Landscapes',
      image: '/src/assets/images/gir-forest-wildlife.jpg',
      photographer: 'Paul Garcia',
      gridRow: 2,
    },
  ]
}
