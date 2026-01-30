import { motion } from 'framer-motion'
import { AlertCircle, Check } from 'lucide-react'

/**
 * Input Component
 * Reusable input field with label, error, success, and various types
 * Props: label, error, success, type, placeholder, value, onChange, disabled, 
 *        required, icon, rightIcon, size (sm, md, lg), fullWidth, ...rest
 */
export default function Input({
  label,
  error,
  success,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  icon: Icon,
  rightIcon: RightIcon,
  size = 'md',
  fullWidth = true,
  className = '',
  ...rest
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  }

  const borderClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : success
    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={20} />
          </div>
        )}

        <motion.input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full rounded-lg border-2 transition-all duration-200
            ${sizeClasses[size]}
            ${borderClasses}
            ${Icon ? 'pl-10' : ''}
            ${RightIcon ? 'pr-10' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
            focus:outline-none focus:ring-2
            ${className}
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          {...rest}
        />

        {/* Right Icon - Status */}
        {RightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <RightIcon size={20} />
          </div>
        )}

        {success && (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Check size={20} />
          </motion.div>
        )}

        {error && (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <AlertCircle size={20} />
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          className="text-sm text-red-600 mt-2 flex items-center gap-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={16} />
          {error}
        </motion.p>
      )}

      {/* Success Message */}
      {success && !error && (
        <motion.p
          className="text-sm text-green-600 mt-2 flex items-center gap-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Check size={16} />
          Looks good!
        </motion.p>
      )}
    </div>
  )
}
