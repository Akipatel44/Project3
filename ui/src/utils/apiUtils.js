/**
 * API Utilities
 * Common API-related utility functions
 */

export const buildQueryParams = (params = {}) => {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
}

export const parseApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return 'An error occurred'
}

export const getAuthToken = () => {
  return localStorage.getItem('access_token')
}

export const setAuthToken = (token) => {
  localStorage.setItem('access_token', token)
}

export const removeAuthToken = () => {
  localStorage.removeItem('access_token')
}

export const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]))
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
