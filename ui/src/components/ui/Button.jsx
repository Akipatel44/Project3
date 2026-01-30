import { motion } from 'framer-motion'

/**
 * Button Component
 * Reusable button with multiple variants
 * Props: variant (primary, secondary, danger), size (sm, md, lg), children, ...rest
 */
export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled = false,
  ...rest 
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  }

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
