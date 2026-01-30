import { motion } from 'framer-motion'
import { ChevronRight, Star, MapPin, Calendar } from 'lucide-react'

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container-max">
          <motion.div
            className="max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-4"
              variants={itemVariants}
            >
              Welcome to OsamVista
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-primary-100"
              variants={itemVariants}
            >
              Explore the sacred temples, mythological wonders, and natural beauty of Gujarat
            </motion.p>
            <motion.button
              className="btn-primary bg-white text-primary-600 hover:bg-primary-50 flex items-center gap-2"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Now
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-white"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container-max">
          <motion.h2
            className="text-4xl font-bold text-center mb-12"
            variants={itemVariants}
          >
            Discover What Awaits
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-12 h-12" />,
                title: "Sacred Places",
                description: "Visit ancient temples and mythological sites across Gujarat",
              },
              {
                icon: <Calendar className="w-12 h-12" />,
                title: "Cultural Events",
                description: "Participate in vibrant festivals and traditional celebrations",
              },
              {
                icon: <Star className="w-12 h-12" />,
                title: "Gallery",
                description: "Browse stunning photos and imagery of our destinations",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card border border-gray-200"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-16 bg-primary-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Start your journey through the spiritual and cultural wonders of Gujarat. 
            Browse our curated collection of places, events, and experiences.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="btn-primary bg-white text-primary-600 hover:bg-primary-50">
              View Places
            </button>
            <button className="btn-secondary bg-primary-500 text-white hover:bg-primary-400">
              See Events
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
