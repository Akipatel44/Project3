import { motion } from 'framer-motion'

/**
 * Input Component
 * Reusable input field with label and error handling
 * Props: label, error, type, placeholder, value, onChange, ...rest
 */
export default function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  ...rest
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...rest}
      />
      {error && (
        <motion.p 
          className="text-sm text-red-600 mt-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
