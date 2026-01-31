import { motion } from 'framer-motion'
import { ChevronRight, ChevronDown, Star, MapPin, Calendar, ArrowRight, Award, Zap, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { FALLBACK_IMAGE, withFallback } from '@/utils/imageUtils'

const Home = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  }

  const slideInVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  // Hero Section with parallax effect
  return (
    <div className="w-full overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <motion.section
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={withFallback('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&h=900&fit=crop')}
          alt=""
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE
          }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ y: scrollY * 0.2 }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

        {/* Parallax Background Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none"
          style={{ y: scrollY * 0.5 }}
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Discover OsamVista
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto"
            >
              Explore sacred temples, spiritual journeys, and cultural heritage of Gujarat
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#fbbf24' }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-400 text-gray-900 font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                Explore Now
                <ChevronRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-all"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none"
        >
          <ChevronDown size={32} className="text-white" />
        </motion.div>
      </motion.section>

      {/* ==================== OSAM HILL INTRO ==================== */}
      <motion.section
        className="relative py-20 lg:py-32 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div variants={slideInVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.span
                className="text-primary-600 font-semibold text-lg"
                variants={itemVariants}
              >
                SACRED DESTINATION
              </motion.span>
              <motion.h2
                className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6"
                variants={itemVariants}
              >
                Welcome to Osam Hill
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 mb-6 leading-relaxed"
                variants={itemVariants}
              >
                Osam Hill stands as a beacon of spiritual significance and natural beauty. This sacred destination 
                blends ancient traditions with modern experiences, offering visitors a transformative journey through 
                carefully preserved temples and cultural landmarks.
              </motion.p>
              <motion.p
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                variants={itemVariants}
              >
                Every stone tells a story, every path leads to discovery. Our curated collection showcases the best 
                of what Osam Hill has to offer, from serene meditation spots to vibrant cultural celebrations.
              </motion.p>

              <motion.div className="flex flex-wrap gap-6 mb-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {[
                  { icon: Award, label: 'Heritage Site' },
                  { icon: Zap, label: 'Spiritual Energy' },
                  { icon: Globe, label: 'Global Recognition' },
                ].map((item, idx) => (
                  <motion.div key={idx} className="flex items-center gap-3" variants={itemVariants}>
                    <div className="text-primary-600 bg-primary-100 p-3 rounded-lg">
                      <item.icon size={24} />
                    </div>
                    <span className="font-semibold text-gray-900">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
              >
                Explore Osam Hill
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>

            {/* Right Image */}
            <motion.div
              className="relative h-96 lg:h-full min-h-96 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={withFallback('https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&h=900&fit=crop')}
                alt="Osam Hill Temple"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ==================== HIGHLIGHTS CARDS ==================== */}
      <motion.section
        className="py-20 lg:py-32 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span className="text-primary-600 font-semibold text-lg" variants={itemVariants}>
              FEATURED EXPERIENCES
            </motion.span>
            <motion.h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4" variants={itemVariants}>
              Highlights & Attractions
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Sacred Places',
                description: 'Visit ancient temples and mythological sites that hold centuries of spiritual significance',
                icon: MapPin,
                image: 'https://images.unsplash.com/photo-1512207736139-6c3ee1990e77?w=600&h=400&fit=crop',
                count: '24 Sites',
              },
              {
                title: 'Cultural Events',
                description: 'Participate in vibrant festivals and traditional celebrations throughout the year',
                icon: Calendar,
                image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&h=400&fit=crop',
                count: '12 Events',
              },
              {
                title: 'Photo Gallery',
                description: 'Browse stunning photography and imagery showcasing the beauty of our destinations',
                icon: Star,
                image: 'https://images.unsplash.com/photo-1606933248051-5ce88adc6aa4?w=600&h=400&fit=crop',
                count: '500+ Images',
              },
            ].map((highlight, index) => (
              <motion.div
                key={index}
                className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                {/* Card Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={withFallback(highlight.image)}
                    alt={highlight.title}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                </div>

                {/* Card Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <motion.div
                    className="flex items-center gap-2 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <highlight.icon size={24} />
                    <span className="text-sm font-semibold bg-primary-600 px-3 py-1 rounded-full">
                      {highlight.count}
                    </span>
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">{highlight.title}</h3>
                  <p className="text-gray-100 text-sm leading-relaxed">{highlight.description}</p>

                  <motion.button
                    whileHover={{ x: 5 }}
                    className="mt-4 flex items-center gap-2 text-primary-400 font-semibold hover:text-primary-300"
                  >
                    Learn More
                    <ChevronRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ==================== CTA SECTION ==================== */}
      <motion.section
        className="relative py-24 lg:py-32 bg-cover bg-center overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <img
          src={withFallback('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=600&fit=crop')}
          alt=""
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span className="text-amber-400 font-semibold text-lg" variants={itemVariants}>
              BEGIN YOUR JOURNEY
            </motion.span>
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-6"
              variants={itemVariants}
            >
              Ready to Explore OsamVista?
            </motion.h2>
            <motion.p
              className="text-lg lg:text-xl text-gray-100 mb-12 max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Start your spiritual and cultural journey today. Discover sacred places, participate in traditional 
              events, and capture memories at one of India's most cherished destinations.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-400 text-gray-900 font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors shadow-lg"
              >
                Browse Places
                <ChevronRight size={20} />
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition-colors"
              >
                View Events
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition-colors"
              >
                See Gallery
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-16 grid grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { number: '24+', label: 'Sacred Places' },
                { number: '12+', label: 'Annual Events' },
                { number: '500+', label: 'Photos' },
              ].map((stat, idx) => (
                <motion.div key={idx} className="text-center" variants={itemVariants}>
                  <div className="text-4xl lg:text-5xl font-bold text-amber-400 mb-2">{stat.number}</div>
                  <div className="text-gray-200">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ==================== FOOTER CTA ==================== */}
      <motion.section
        className="py-12 bg-gray-900 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="max-w-4xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p className="text-gray-300 mb-4" variants={itemVariants}>
            Questions or need help planning your visit?
          </motion.p>
          <motion.a
            href="mailto:info@osamvista.com"
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center justify-center gap-2"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            Contact Us
            <ChevronRight size={18} />
          </motion.a>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default Home
