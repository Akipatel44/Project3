import { motion } from 'framer-motion'

/**
 * Loader Component
 * Reusable loading spinner
 * Props: size (sm, md, lg), fullPage (boolean)
 */
export default function Loader({ size = 'md', fullPage = false }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const loader = (
    <motion.div
      className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )

  if (fullPage) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {loader}
      </div>
    )
  }

  return <div className="flex justify-center items-center py-8">{loader}</div>
}
