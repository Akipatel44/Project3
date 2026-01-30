import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor - Add JWT token to all requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response Interceptor - Central error handling
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific status codes
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return Promise.reject(new Error('Session expired. Please login again.'))
    }

    if (error.response?.status === 403) {
      return Promise.reject(new Error('Access denied. You do not have permission.'))
    }

    if (error.response?.status === 404) {
      return Promise.reject(new Error('Resource not found.'))
    }

    if (error.response?.status === 422) {
      // Validation error
      const messages = error.response.data?.detail || 'Validation failed'
      return Promise.reject(new Error(messages))
    }

    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'))
    }

    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Network error. Please check your connection.'))
    }

    return Promise.reject(error.response?.data?.detail || error.message || 'An error occurred')
  }
)

/**
 * Places API
 */
export const placesAPI = {
  getAll: (params) => api.get('/api/v1/places', { params }),
  getById: (id) => api.get(`/api/v1/places/${id}`),
  create: (data) => api.post('/api/v1/places', data),
  update: (id, data) => api.put(`/api/v1/places/${id}`, data),
  delete: (id) => api.delete(`/api/v1/places/${id}`),
}

/**
 * Events API
 */
export const eventsAPI = {
  getAll: (params) => api.get('/api/v1/events', { params }),
  getById: (id) => api.get(`/api/v1/events/${id}`),
  create: (data) => api.post('/api/v1/events', data),
  update: (id, data) => api.put(`/api/v1/events/${id}`, data),
  delete: (id) => api.delete(`/api/v1/events/${id}`),
}

/**
 * Gallery API
 */
export const galleryAPI = {
  getAll: (params) => api.get('/api/v1/gallery', { params }),
  getById: (id) => api.get(`/api/v1/gallery/${id}`),
  create: (data) => api.post('/api/v1/gallery', data),
  update: (id, data) => api.put(`/api/v1/gallery/${id}`, data),
  delete: (id) => api.delete(`/api/v1/gallery/${id}`),
}

/**
 * Users API (Admin)
 */
export const usersAPI = {
  getAll: (params) => api.get('/api/v1/users', { params }),
  getById: (id) => api.get(`/api/v1/users/${id}`),
  create: (data) => api.post('/api/v1/users', data),
  update: (id, data) => api.put(`/api/v1/users/${id}`, data),
  delete: (id) => api.delete(`/api/v1/users/${id}`),
  getCurrentUser: () => api.get('/api/v1/users/me'),
}

/**
 * Authentication API
 */
export const authAPI = {
  login: (email, password) => api.post('/api/v1/auth/login', { email, password }),
  register: (data) => api.post('/api/v1/auth/register', data),
  verifyOTP: (email, otp) => api.post('/api/v1/auth/verify-otp', { email, otp }),
  refresh: () => api.post('/api/v1/auth/refresh'),
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    return Promise.resolve()
  },
}

/**
 * Error Utility - Extract meaningful error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error.response?.data?.detail) return error.response.data.detail
  if (error.response?.data?.message) return error.response.data.message
  if (error.message) return error.message
  return 'An error occurred. Please try again.'
}

/**
 * Success Toast Utility
 */
export const showSuccess = (message) => {
  // Can be integrated with a toast library later
  console.log('Success:', message)
}

export default api
