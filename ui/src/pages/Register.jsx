import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Sprout, ArrowLeft } from 'lucide-react'
import { AuthLayout } from '@/components/layout'
import { Input, Button } from '@/components/ui'
import { isEmail, isStrongPassword } from '@/utils'
import { authAPI } from '@/services/api'

/**
 * Register Page
 * User registration page with form validation
 * Nature-inspired design with soft shadows and modern 2025 UI
 */
export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!isStrongPassword(formData.password)) {
      newErrors.password = 'Password must have: 8+ chars, uppercase, lowercase, number'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await authAPI.register({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password
      })
      navigate('/login', { state: { message: 'Registration successful! Please login.' } })
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.')
      console.error('Register error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <AuthLayout>
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-green-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/login')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          variants={itemVariants}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Login</span>
        </motion.button>

        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div
            className="flex justify-center mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-full">
              <Sprout className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Join OsamVista
          </h1>
          <p className="text-gray-500 text-sm">Create your account to explore heritage</p>
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} variants={itemVariants}>
          {/* API Error Alert */}
          {apiError && (
            <motion.div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              {apiError}
            </motion.div>
          )}

          {/* Full Name Field */}
          <motion.div variants={itemVariants}>
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              disabled={isLoading}
            />
          </motion.div>

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
              disabled={isLoading}
            />
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants}>
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              disabled={isLoading}
            />
            {formData.password && (
              <motion.p
                className="text-xs text-gray-500 mt-2 ml-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                  ✓ At least 8 characters
                </span>
                <span className={/[A-Z]/.test(formData.password) ? ' text-green-600' : ''}>
                  {' '}• Uppercase letter
                </span>
                <span className={/[a-z]/.test(formData.password) ? ' text-green-600' : ''}>
                  {' '}• Lowercase letter
                </span>
                <span className={/[0-9]/.test(formData.password) ? ' text-green-600' : ''}>
                  {' '}• Number
                </span>
              </motion.p>
            )}
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div variants={itemVariants}>
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </motion.div>

          {/* Terms Checkbox */}
          <motion.div
            className="flex items-start gap-3 mb-6"
            variants={itemVariants}
          >
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 rounded border-gray-300 cursor-pointer mt-1"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
              I agree to the{' '}
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Privacy Policy
              </a>
            </label>
          </motion.div>

          {/* Register Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  ⏳
                </motion.span>
              ) : (
                'Create Account'
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Already Have Account */}
        <motion.p
          className="text-center text-sm text-gray-600 mt-6"
          variants={itemVariants}
        >
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            Sign In
          </button>
        </motion.p>
      </motion.div>

      {/* Background Decoration */}
      <motion.div
        className="fixed -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-3xl opacity-20 -z-10"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="fixed -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-300 to-cyan-200 rounded-full blur-3xl opacity-20 -z-10"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </AuthLayout>
  )
}
