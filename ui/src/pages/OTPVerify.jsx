import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Smartphone } from 'lucide-react'
import { AuthLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import OTPInput from '@/components/ui/OTPInput'
import { useAuth } from '@/context'

/**
 * OTP Verification Page
 * Verify user with 6-digit OTP
 * Static OTP for demo: 123456
 */
export default function OTPVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyOTP, setUser } = useAuth()
  
  // Get email from previous page or use default
  const email = location.state?.email || 'user@example.com'
  
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const devUser = {
        id: 1,
        email,
        name: email?.split('@')?.[0] || 'User',
        role: 'USER'
      }
      localStorage.setItem('access_token', 'dev-token')
      localStorage.setItem('user', JSON.stringify(devUser))
      setUser(devUser)

      setSuccess(true)
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 300)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    // Simulate resend
    setOtp('')
    setError('')
    setSuccess(false)
    console.log('OTP resent to', email)
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

  if (success) {
    return (
      <AuthLayout>
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle className="w-16 h-16 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Verified!</h2>
          <p className="text-gray-600 mb-6">Your email has been verified successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </motion.div>
      </AuthLayout>
    )
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
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-full">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
          <p className="text-gray-500">We've sent a 6-digit code to</p>
          <p className="text-gray-700 font-medium mt-1">{email}</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        {/* Form */}
        <motion.form onSubmit={handleSubmit} variants={itemVariants}>
          {/* OTP Input */}
          <motion.div className="mb-8" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter the 6-digit code
            </label>
            <OTPInput
              value={otp}
              onChange={setOtp}
              error={!!error}
            />
            <p className="text-xs text-gray-500 text-center mt-3">
              Enter the OTP sent to your email
            </p>
          </motion.div>

          {/* Verify Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || otp.length !== 6}
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
                'Verify Email'
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Resend Section */}
        <motion.div
          className="mt-6 text-center border-t border-gray-200 pt-6"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-green-600 hover:text-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Resend OTP
          </button>
        </motion.div>

        {/* Back Button */}
        <motion.div
          className="mt-6 text-center"
          variants={itemVariants}
        >
          <button
            onClick={() => navigate('/register')}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            ← Back to Registration
          </button>
        </motion.div>

        {/* Info Box */}
        <motion.div
          className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4"
          variants={itemVariants}
        >
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-700">Tips:</span>
            {' '}The code expires in 10 minutes. Check your spam folder if you don't see the email.
          </p>
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
