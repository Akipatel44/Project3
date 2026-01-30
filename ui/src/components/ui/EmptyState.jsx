import { motion } from 'framer-motion'
import { Package, Search, AlertCircle, Heart } from 'lucide-react'

/**
 * EmptyState Component
 * Reusable empty state display
 * Props: icon, title, description, action, actionLabel, type (empty, error, no-results, no-favorites)
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel = 'Take Action',
  type = 'empty',
}) {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.1, duration: 0.5 },
    },
  }

  // Default configs by type
  const configs = {
    empty: {
      icon: Icon || Package,
      title: title || 'No items yet',
      description: description || 'Start by creating your first item',
      iconColor: 'text-gray-400',
      iconBg: 'bg-gray-100',
    },
    'no-results': {
      icon: Icon || Search,
      title: title || 'No results found',
      description: description || 'Try adjusting your filters or search terms',
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-100',
    },
    error: {
      icon: Icon || AlertCircle,
      title: title || 'Something went wrong',
      description: description || 'Please try again later',
      iconColor: 'text-red-400',
      iconBg: 'bg-red-100',
    },
    'no-favorites': {
      icon: Icon || Heart,
      title: title || 'No favorites yet',
      description: description || 'Start adding items to your favorites',
      iconColor: 'text-pink-400',
      iconBg: 'bg-pink-100',
    },
  }

  const config = configs[type] || configs.empty
  const DefaultIcon = config.icon

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial="hidden"
      animate="visible"
      variants={contentVariants}
    >
      {/* Icon */}
      <motion.div
        className={`${config.iconBg} rounded-full p-6 mb-6`}
        variants={iconVariants}
      >
        <DefaultIcon size={48} className={config.iconColor} />
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-2xl font-bold text-gray-900 mb-2 text-center"
        variants={contentVariants}
      >
        {config.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-gray-600 text-center max-w-sm mb-8"
        variants={contentVariants}
      >
        {config.description}
      </motion.p>

      {/* Action Button */}
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            type === 'error'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : type === 'no-results'
              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
          variants={contentVariants}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}
