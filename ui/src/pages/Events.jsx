import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import EventCard from '@/components/ui/EventCard'
import { Search, X, Loader } from 'lucide-react'
import { eventsAPI } from '@/services/api'
import { resolveImageUrl } from '@/utils/imageUtils'

/**
 * Events Page
 * Display upcoming and past cultural events
 */
export default function Events() {
  const [allEvents, setAllEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch events from API
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch from API
      const response = await eventsAPI.getAll()
      const rawEvents = response.data?.events || response.data || []
      const data = rawEvents.map((event) => ({
        ...event,
        category: event.category || event.event_type || 'Cultural',
        location: event.location || event.address || '',
        image: resolveImageUrl(
          convertBackendImagePath(event.image_url) || event.image || event.imageUrl || event.cover_image || event.banner_url
        ),
      }))

      setAllEvents(data)

      // Separate upcoming and past events
      const now = new Date()
      const upcoming = data.filter(event => new Date(event.start_date || event.date) >= now)
      const past = data.filter(event => new Date(event.start_date || event.date) < now)

      setUpcomingEvents(upcoming)
      setPastEvents(past)

      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map(event => event.category).filter(Boolean))]
      setCategories(uniqueCategories)
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to load events. Please try again later.')
      // Fallback mock data
      const mockData = getMockEvents()
      setAllEvents(mockData)
      const now = new Date()
      setUpcomingEvents(mockData.filter(e => new Date(e.date) >= now))
      setPastEvents(mockData.filter(e => new Date(e.date) < now))
      setCategories(['All', 'Religious', 'Cultural', 'Festival', 'Celebration'])
    } finally {
      setLoading(false)
    }
  }

  // Convert backend image paths to local asset paths
  const convertBackendImagePath = (imagePath) => {
    if (!imagePath) return null
    
    // If it's already a local path, return it
    if (imagePath.startsWith('/src/assets/')) {
      return imagePath
    }
    
    // Convert /api/images/filename.jpg to /src/assets/images/filename.jpg
    if (imagePath.includes('/api/images/') || imagePath.startsWith('/images/')) {
      const filename = imagePath.split('/').pop()
      return `/src/assets/images/${filename}`
    }
    
    return imagePath
  }

  // Get filtered events based on tab and filters
  const getFilteredEvents = () => {
    const events = activeTab === 'upcoming' ? upcomingEvents : pastEvents
    let filtered = events

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        event =>
          event.name.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          (event.location && event.location.toLowerCase().includes(term))
      )
    }

    return filtered
  }

  const filteredEvents = getFilteredEvents()

  // Clear filters
  const clearFilters = () => {
    setSelectedCategory('All')
    setSearchTerm('')
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
          className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.span className="text-amber-100 font-semibold text-sm uppercase" variants={itemVariants}>
                Celebrate & Connect
              </motion.span>
              <motion.h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-4" variants={itemVariants}>
                Cultural Events
              </motion.h1>
              <motion.p className="text-lg text-amber-100 max-w-2xl" variants={itemVariants}>
                Experience vibrant festivals, traditional celebrations, and spiritual gatherings at Osam Hill. 
                Join our community in honoring rich cultural heritage.
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
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              {['upcoming', 'past'].map(tab => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(tab)
                    clearFilters()
                  }}
                  className={`px-6 py-3 font-semibold text-sm transition-all capitalize border-b-2 ${
                    activeTab === tab
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'upcoming' ? 'Upcoming' : 'Past'} Events
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {activeTab === 'upcoming' ? upcomingEvents.length : pastEvents.length}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events by name, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
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
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-amber-600 text-white shadow-lg'
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
                  Showing {filteredEvents.length} of{' '}
                  {activeTab === 'upcoming' ? upcomingEvents.length : pastEvents.length} events
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
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
                  <Loader size={48} className="text-amber-600" />
                </motion.div>
                <p className="text-gray-600 mt-4 font-semibold">Loading events...</p>
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
                  onClick={fetchEvents}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-gray-600 text-lg font-semibold mb-4">
                  {searchTerm || selectedCategory !== 'All'
                    ? 'No events found matching your criteria'
                    : activeTab === 'upcoming'
                    ? 'No upcoming events scheduled'
                    : 'No past events to display'}
                </p>
                {(searchTerm || selectedCategory !== 'All') && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Clear Filters
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Events Grid */}
            {!loading && !error && filteredEvents.length > 0 && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredEvents.map((event, index) => (
                  <EventCard
                    key={event.id || index}
                    event={event}
                    index={index}
                    isPast={activeTab === 'past'}
                    onViewDetails={event => {
                      console.log('View details for:', event)
                      // TODO: Navigate to event detail page
                    }}
                  />
                ))}
              </motion.div>
            )}

            {/* Result Count */}
            {!loading && !error && filteredEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-12"
              >
                <p className="text-gray-600 font-semibold">
                  Showing {filteredEvents.length} of{' '}
                  {activeTab === 'upcoming' ? upcomingEvents.length : pastEvents.length} events
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>
      </div>
  )
}

// Mock data for fallback
function getMockEvents() {
  const now = new Date()
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  const pastDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000) // 15 days ago

  return [
    {
      id: 1,
      name: 'Maha Shivaratri Festival',
      description: 'Grand celebration of Lord Shiva with rituals, music, and traditional performances.',
      category: 'Religious',
      date: futureDate.toISOString().split('T')[0],
      time: '06:00',
      location: 'Osam Hill Temple Complex',
      image: '/src/assets/images/osam-hill-temple.jpg',
      attendees: 5000,
    },
    {
      id: 2,
      name: 'Somnath Marathon',
      description: 'Marathon event along the coastal pilgrimage route.',
      category: 'Festival',
      date: new Date(futureDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '18:00',
      location: 'Somnath, Gujarat',
      image: '/src/assets/images/somnath-marathon.jpg',
      attendees: 3000,
    },
    {
      id: 3,
      name: 'Navratri Dance Program',
      description: 'Traditional Garba and Dandiya performances by local artists.',
      category: 'Cultural',
      date: new Date(futureDate.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '19:00',
      location: 'Cultural Center, Osam Hill',
      image: '/src/assets/images/osam-hill-flowers.jpg',
      attendees: 2000,
    },
    {
      id: 4,
      name: 'Dwarka Temple Festival',
      description: 'Colorful celebration with music, food, and community gathering.',
      category: 'Celebration',
      date: new Date(futureDate.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '07:00',
      location: 'Dwarka, Gujarat',
      image: '/src/assets/images/dwarka.jpg',
      attendees: 4000,
    },
    {
      id: 5,
      name: 'Spiritual Meditation Session',
      description: 'Guided meditation and spiritual practices for inner peace.',
      category: 'Religious',
      date: pastDate.toISOString().split('T')[0],
      time: '06:00',
      location: 'Meditation Pavilion',
      image: '/src/assets/images/osam-hill1.jpg',
      attendees: 500,
    },
    {
      id: 6,
      name: 'Heritage Walking Tour',
      description: 'Guided tour exploring the historical significance of sacred sites.',
      category: 'Cultural',
      date: new Date(pastDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '09:00',
      location: 'Palitana Temples',
      image: '/src/assets/images/palitana-temples.jpg',
      attendees: 1000,
    },
  ]
}
