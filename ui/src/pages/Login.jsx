import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Sprout } from 'lucide-react'
import { AuthLayout } from '@/components/layout'
import { Input, Button } from '@/components/ui'
import { isEmail } from '@/utils'
import { authAPI } from '@/services/api'
import { useAuth } from '@/context'

/**
 * Login Page
 * User authentication page with email and password fields
 * Nature-inspired design with soft shadows and modern 2025 UI
 */
export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: 'admin@osamvista.com',
    password: 'Admin@123'
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
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
      const result = await login(formData.email, formData.password)
      if (result.success) {
        // Redirect to dashboard after successful login
        navigate('/admin/dashboard')
      } else {
        setApiError(result.error || 'Login failed. Please try again.')
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.')
      console.error('Login error:', error)
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
        staggerChildren: 0.1
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
            OsamVista
          </h1>
          <p className="text-gray-500 text-sm">Explore Heritage, Connect Culture</p>
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

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="admin@osamvista.com"
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
              autoComplete="current-password"
              disabled={isLoading}
            />
          </motion.div>

          {/* Remember & Forgot */}
          <motion.div
            className="flex items-center justify-between mb-6 text-sm"
            variants={itemVariants}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-green-600 hover:text-green-700 font-medium">
              Forgot password?
            </a>
          </motion.div>

          {/* Login Button */}
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
                'Sign In'
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Divider */}
        <motion.div
          className="relative my-6"
          variants={itemVariants}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </motion.div>

        {/* Register Button */}
        <motion.div variants={itemVariants}>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={isLoading}
            className="w-full"
            onClick={() => navigate('/register')}
          >
            Create New Account
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-xs text-gray-500 mt-6"
          variants={itemVariants}
        >
          By signing in, you agree to our{' '}
          <a href="#" className="text-green-600 hover:text-green-700 font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-green-600 hover:text-green-700 font-medium">
            Privacy Policy
          </a>
        </motion.p>

        {/* Demo Credentials */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-100"
          variants={itemVariants}
        >
          <p className="text-xs text-gray-500 text-center mb-3">Demo Credentials</p>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <p className="text-xs text-gray-700 mb-1">
              <span className="font-semibold text-gray-800">Email:</span> admin@osamvista.com
            </p>
            <p className="text-xs text-gray-700">
              <span className="font-semibold text-gray-800">Password:</span> Admin@123
            </p>
          </div>
        </motion.div>
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
