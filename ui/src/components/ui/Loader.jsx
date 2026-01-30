import { motion } from 'framer-motion'

/**
 * Loader Component
 * Reusable loading spinner
 * Props: size (sm, md, lg), variant (primary, secondary, danger, success), text, fullScreen
 */
export default function Loader({
  size = 'md',
  variant = 'primary',
  text,
  fullScreen = false,
  overlay = false,
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  }

  const variantClasses = {
    primary: 'border-primary-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    danger: 'border-red-600 border-t-transparent',
    success: 'border-green-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  }

  const spinVariants = {
    spin: {
      rotate: 360,
      transition: { duration: 1, repeat: Infinity, ease: 'linear' },
    },
  }

  const loaderContent = (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}
        animate="spin"
        variants={spinVariants}
      />
      {text && (
        <motion.p
          className="mt-4 text-gray-600 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-white z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {loaderContent}
      </motion.div>
    )
  }

  if (overlay) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {loaderContent}
      </motion.div>
    )
  }

  return loaderContent
}
