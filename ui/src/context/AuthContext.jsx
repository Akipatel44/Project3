import { createContext, useContext, useState, useCallback } from 'react'

/**
 * AuthContext
 * Global authentication state management
 * Provides: user, login, logout, isAuthenticated
 */
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('access_token', userData.token)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('access_token')
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    setUser,
    setIsLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
