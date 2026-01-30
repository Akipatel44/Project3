import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * OTPInput Component
 * Reusable OTP input with 6 boxes and auto-focus functionality
 * Props: value (string), onChange (function), error (boolean)
 */
export default function OTPInput({ value = '', onChange, error = false }) {
  const inputRefs = useRef([])

  // Set refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleInput = (e, index) => {
    const input = e.target
    let newValue = input.value.replace(/\D/g, '') // Only allow digits

    // Limit to 1 digit per box
    if (newValue.length > 1) {
      newValue = newValue.slice(-1)
    }

    // Build complete OTP value
    const otpArray = value.split('')
    otpArray[index] = newValue
    const completeOTP = otpArray.join('')

    onChange(completeOTP)

    // Auto-focus next input
    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    const input = e.target

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault()
      
      if (input.value) {
        // Clear current box
        const otpArray = value.split('')
        otpArray[index] = ''
        onChange(otpArray.join(''))
      } else if (index > 0) {
        // Focus previous box
        inputRefs.current[index - 1]?.focus()
      }
    }

    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }

    // Handle right arrow
    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '')
    
    if (pastedData.length <= 6) {
      onChange(pastedData.padEnd(6, ''))
      // Focus appropriate input
      const nextEmptyIndex = Math.min(pastedData.length, 5)
      inputRefs.current[nextEmptyIndex]?.focus()
    }
  }

  const handleFocus = (e) => {
    e.target.select()
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05
      }
    }
  }

  const boxVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div
      className="flex gap-3 justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onPaste={handlePaste}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          variants={boxVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={value[index] || ''}
            onChange={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={handleFocus}
            className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none ${
              error
                ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300'
                : 'border-gray-300 bg-white hover:border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200'
            }`}
            placeholder="•"
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
