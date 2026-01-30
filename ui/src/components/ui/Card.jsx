import { motion } from 'framer-motion'

/**
 * Card Component
 * Reusable card container for content
 * Props: children, className, hover, ...rest
 */
export default function Card({ 
  children, 
  className = '', 
  hover = true,
  ...rest 
}) {
  return (
    <motion.div
      className={`card ${hover ? 'hover:shadow-lg' : ''} ${className}`}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
