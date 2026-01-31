import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { Home, Login, Register, OTPVerify, Places, Events, Gallery } from './pages'
import Dashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminPlaces from './pages/admin/Places'
import AdminEvents from './pages/admin/Events'
import AdminGallery from './pages/admin/Gallery'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/context'

function App() {
  const { isAuthenticated } = useAuth()

  const RequireAuth = ({ children }) =>
    isAuthenticated ? children : <Navigate to="/login" replace />

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <MainLayout>
                  <Home />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerify />} />
          <Route
            path="/places"
            element={
              <RequireAuth>
                <MainLayout>
                  <Places />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/events"
            element={
              <RequireAuth>
                <MainLayout>
                  <Events />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/gallery"
            element={
              <RequireAuth>
                <MainLayout>
                  <Gallery />
                </MainLayout>
              </RequireAuth>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAuth>
                <AdminUsers />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/places"
            element={
              <RequireAuth>
                <AdminPlaces />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/events"
            element={
              <RequireAuth>
                <AdminEvents />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <RequireAuth>
                <AdminGallery />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
