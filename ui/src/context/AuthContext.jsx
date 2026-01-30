import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authAPI, getErrorMessage } from '@/services/api'

/**
 * AuthContext
 * Global authentication state management with API integration
 * Provides: user, login, logout, register, isAuthenticated, isLoading, error
 */
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
      }
    }
  }, [])

  // Login with API
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authAPI.login(email, password)
      const { access_token, user: userData } = response.data

      // Store token and user
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))

      setUser(userData)
      return { success: true, user: userData }
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Register with API
  const register = useCallback(async (data) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authAPI.register(data)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Verify OTP with API
  const verifyOTP = useCallback(async (email, otp) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authAPI.verifyOTP(email, otp)
      const { access_token, user: userData } = response.data

      // Store token and user
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))

      setUser(userData)
      return { success: true, user: userData }
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout
  const logout = useCallback(() => {
    authAPI.logout()
    setUser(null)
    setError(null)
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    verifyOTP,
    logout,
    clearError,
    setUser,
    setIsLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
