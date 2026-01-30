import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'

const GalleryItem = ({ item, index, onClick }) => {
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: index * 0.05 },
    },
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer h-full"
      onClick={() => onClick && onClick(item)}
    >
      {/* Image */}
      <img
        src={item.image || 'https://via.placeholder.com/400x300?text=Gallery'}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Content - appears on hover */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">{item.title}</h3>
        {item.category && (
          <p className="text-gray-200 text-xs uppercase font-semibold mb-3">{item.category}</p>
        )}
        {item.description && (
          <p className="text-gray-300 text-sm line-clamp-2 mb-3">{item.description}</p>
        )}

        {/* View Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-lg transition-colors w-fit mx-auto"
        >
          <Maximize2 size={16} />
          View Full
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default GalleryItem
