import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Places API
export const placesAPI = {
  getAll: (params) => api.get('/api/v1/places', { params }),
  getById: (id) => api.get(`/api/v1/places/${id}`),
  create: (data) => api.post('/api/v1/places', data),
  update: (id, data) => api.put(`/api/v1/places/${id}`, data),
  delete: (id) => api.delete(`/api/v1/places/${id}`),
}

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/api/v1/events', { params }),
  getById: (id) => api.get(`/api/v1/events/${id}`),
  create: (data) => api.post('/api/v1/events', data),
  update: (id, data) => api.put(`/api/v1/events/${id}`, data),
  delete: (id) => api.delete(`/api/v1/events/${id}`),
}

// Gallery API
export const galleryAPI = {
  getAll: (params) => api.get('/api/v1/gallery', { params }),
  getById: (id) => api.get(`/api/v1/gallery/${id}`),
  create: (data) => api.post('/api/v1/gallery', data),
  update: (id, data) => api.put(`/api/v1/gallery/${id}`, data),
  delete: (id) => api.delete(`/api/v1/gallery/${id}`),
}

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/api/v1/auth/login', { email, password }),
  register: (data) => api.post('/api/v1/auth/register', data),
  logout: () => {
    localStorage.removeItem('access_token')
    return Promise.resolve()
  },
}

export default api
