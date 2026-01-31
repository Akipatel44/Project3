import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { FALLBACK_IMAGE, resolveImageUrl } from '@/utils/imageUtils'

const GalleryModal = ({ isOpen, item, items = [], currentIndex = 0, onClose, onNext, onPrev }) => {
  if (!isOpen || !item) return null

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full h-full max-w-5xl max-h-screen flex flex-col bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur text-white p-3 rounded-lg transition-colors"
            >
              <X size={24} />
            </motion.button>

            {/* Main Image Container */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              <motion.img
                key={item.id}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                src={resolveImageUrl(item.image) || FALLBACK_IMAGE}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE
                }}
                className="w-full h-full object-contain"
              />

              {/* Navigation Buttons */}
              {items.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onPrev}
                    className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur text-white p-3 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onNext}
                    className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur text-white p-3 rounded-lg transition-colors"
                  >
                    <ChevronRight size={24} />
                  </motion.button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur text-white px-4 py-2 rounded-lg">
                    <span className="text-sm font-semibold">
                      {currentIndex + 1} / {items.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Image Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 border-t border-gray-800 p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
              {item.category && (
                <p className="text-primary-400 text-sm uppercase font-semibold mb-3">{item.category}</p>
              )}
              {item.description && (
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              )}
              {item.photographer && (
                <p className="text-gray-500 text-sm mt-4">📸 By {item.photographer}</p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GalleryModal
