# OsamVista Frontend - React + Vite

Modern React frontend for the OsamVista cultural heritage platform. Built with Vite, Tailwind CSS, Framer Motion, and Axios.

---

## Setup

### Prerequisites

- Node.js 16+ (LTS recommended)
- npm 7+ or yarn

### Installation

1. **Navigate to the UI directory**
   ```bash
   cd D:\Project3\ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Copy .env.example to .env (if available)
   # Or create .env with:
   ```
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```

4. **Verify installation**
   ```bash
   npm run dev --version
   ```

---

## Run

### Development Server

**Start the development server with hot reload:**

```bash
cd D:\Project3\ui
npm run dev
```

Server runs at: **http://localhost:5173** (or 5174 if port is in use)

### Build for Production

```bash
npm run build
```

Output: `dist/` folder with optimized production files

### Preview Production Build

```bash
npm run preview
```

### ESLint Check

```bash
npm run lint
```

---

## Folder Structure

```
ui/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx          # Main page wrapper (Navbar + Footer)
│   │   │   ├── AuthLayout.jsx          # Login/Register page layout
│   │   │   ├── AdminLayout.jsx         # Admin sidebar layout
│   │   │   └── Navbar.jsx              # Navigation bar with role-based menu
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx              # Reusable button (6 variants, 5 sizes)
│   │   │   ├── Input.jsx               # Reusable input field
│   │   │   ├── Modal.jsx               # Reusable modal dialog
│   │   │   ├── Loader.jsx              # Loading spinner
│   │   │   ├── EmptyState.jsx          # Empty/error state display
│   │   │   ├── StatsCard.jsx           # Dashboard stat card
│   │   │   ├── PlaceCard.jsx           # Place grid tile
│   │   │   ├── EventCard.jsx           # Event grid tile
│   │   │   ├── GalleryItem.jsx         # Gallery masonry tile
│   │   │   ├── GalleryModal.jsx        # Gallery lightbox modal
│   │   │   └── index.js                # Component exports
│   │   │
│   │   └── index.js                    # Main layout exports
│   │
│   ├── pages/
│   │   ├── Home.jsx                    # Landing page with hero section
│   │   ├── Places.jsx                  # Sacred places browsing page
│   │   ├── Events.jsx                  # Events with upcoming/past tabs
│   │   ├── Gallery.jsx                 # Gallery masonry with modal
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx           # Admin dashboard with stats
│   │   │   ├── Users.jsx               # User management CRUD
│   │   │   ├── Places.jsx              # Place management CRUD
│   │   │   ├── Events.jsx              # Event management CRUD
│   │   │   └── Gallery.jsx             # Gallery management CRUD
│   │   └── auth/
│   │       ├── Login.jsx               # Login with OTP verification
│   │       └── Register.jsx            # User registration
│   │
│   ├── services/
│   │   └── api.js                      # Axios instance + API modules
│   │       ├── axios configuration
│   │       ├── JWT interceptors
│   │       ├── Error handling
│   │       ├── placesAPI
│   │       ├── eventsAPI
│   │       ├── galleryAPI
│   │       ├── usersAPI
│   │       └── authAPI
│   │
│   ├── context/
│   │   └── AuthContext.jsx             # Global auth state management
│   │       ├── user state
│   │       ├── login/logout methods
│   │       ├── error handling
│   │       └── localStorage persistence
│   │
│   ├── utils/
│   │   ├── constants.js                # App constants
│   │   ├── menuConfig.js               # Navigation menu configuration
│   │   └── dateUtils.js                # Date formatting utilities
│   │
│   ├── styles/
│   │   └── globals.css                 # Global Tailwind styles
│   │
│   ├── App.jsx                         # Main app component with routing
│   └── main.jsx                        # React entry point
│
├── public/                             # Static assets
│   └── vite.svg
│
├── .env                                # Environment variables (ignored)
├── .gitignore                          # Git ignore rules
├── index.html                          # HTML entry point
├── package.json                        # Dependencies and scripts
├── tailwind.config.js                  # Tailwind CSS configuration
├── postcss.config.js                   # PostCSS configuration
├── vite.config.js                      # Vite build configuration
└── README.md                           # This file
```

### Key Folders Explained

**components/** - Reusable UI components
- `layout/`: Page layout wrappers
- `ui/`: Individual UI components (buttons, inputs, cards, etc.)

**pages/** - Full page components
- Public pages: Home, Places, Events, Gallery
- Admin pages: Dashboard, Users, Places, Events, Gallery
- Auth pages: Login, Register

**services/** - API communication layer
- `api.js`: Centralized axios instance with interceptors and all API modules

**context/** - Global state management
- `AuthContext.jsx`: Authentication state shared across app

**utils/** - Helper functions and constants
- Configuration, constants, date utilities

---

## Auth Flow

### 1. **Registration**

**User Flow:**
```
Register Page → Enter Email & Password → Submit → API Call
    ↓
Backend creates user → Returns success
    ↓
Auto-redirect to Login
```

**Code Flow:**
```javascript
// src/pages/auth/Register.jsx
const handleRegister = async (formData) => {
  await authContext.register(formData)
  // Redirect to login after success
  navigate('/login')
}

// src/context/AuthContext.jsx
const register = async (email, password, name) => {
  const response = await authAPI.register({ email, password, name })
  // User account created, not logged in yet
  return response.data
}
```

### 2. **Login with OTP**

**User Flow:**
```
Login Page → Enter Email & Password → Submit
    ↓
API sends OTP to email → Show OTP input
    ↓
User enters OTP → Submit
    ↓
API verifies OTP → Returns JWT token
    ↓
Token stored → User logged in → Redirect to dashboard
```

**Code Flow:**
```javascript
// Step 1: Request OTP
const handleLogin = async (email, password) => {
  const response = await authAPI.login(email, password)
  // Server sends OTP to email
  setShowOTPInput(true)
}

// Step 2: Verify OTP and Login
const handleVerifyOTP = async (otp) => {
  const response = await authAPI.verifyOTP(email, otp)
  // response.data.access_token returned
  
  // Store token and user data
  localStorage.setItem('access_token', response.data.access_token)
  localStorage.setItem('user', JSON.stringify(response.data.user))
  
  // Update global auth state
  authContext.setUser(response.data.user)
  authContext.setIsAuthenticated(true)
  
  // Redirect to dashboard
  navigate('/admin/dashboard')
}
```

### 3. **JWT Token Management**

**Auto-injection in all API requests:**
```javascript
// src/services/api.js - Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**Token validation on each request:**
- Server validates JWT signature
- If valid → Request succeeds
- If invalid/expired → Server returns 401 → Frontend clears token → Redirects to login

### 4. **Persistent Login**

**On app load:**
```javascript
// src/context/AuthContext.jsx - useEffect on mount
useEffect(() => {
  const storedUser = localStorage.getItem('user')
  const storedToken = localStorage.getItem('access_token')
  
  if (storedUser && storedToken) {
    // Restore user session from localStorage
    setUser(JSON.parse(storedUser))
    setIsAuthenticated(true)
  }
}, [])
```

User stays logged in even after page refresh (unless token expires on server).

### 5. **Logout**

**User Flow:**
```
User clicks Logout → API call to logout → Token cleared
    ↓
localStorage cleared → Auth state reset
    ↓
Redirect to Login page
```

**Code Flow:**
```javascript
const handleLogout = async () => {
  await authAPI.logout() // Server-side cleanup
  
  // Clear token and user
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  
  // Update auth state
  authContext.setUser(null)
  authContext.setIsAuthenticated(false)
  
  // Redirect
  navigate('/login')
}
```

### 6. **Error Handling**

**Global error interceptor:**
```javascript
// src/services/api.js - Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear session and redirect
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    // Handle other status codes...
  }
)
```

**User-friendly errors:**
```javascript
// Get readable error message
const errorMsg = getErrorMessage(error)
// Shows: "Session expired" or "Invalid credentials" etc.
```

### Authentication Context (Global)

**State:**
```javascript
{
  user: { id, email, name, role },      // Current logged-in user
  isAuthenticated: boolean,               // Login status
  isLoading: boolean,                    // Loading state
  error: string | null                   // Error message
}
```

**Methods:**
```javascript
login(email, password)          // Request OTP
register(email, password, name) // Create account
verifyOTP(email, otp)           // Verify OTP and login
logout()                        // Clear session
clearError()                    // Clear error message
```

**Usage in components:**
```javascript
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

function MyComponent() {
  const auth = useContext(AuthContext)
  
  if (!auth.isAuthenticated) {
    return <Redirect to="/login" />
  }
  
  return <div>Welcome, {auth.user.name}</div>
}
```

---

## Technology Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI framework | 19.0.0 |
| **Vite** | Build tool | 7.3.1 |
| **React Router** | Routing | 7.0.0 |
| **Axios** | HTTP client | 1.7.0 |
| **Tailwind CSS** | Styling | 3.4.0 |
| **Framer Motion** | Animations | 11.0.0 |
| **Lucide React** | Icons | 0.468.0 |

---

## API Integration

### Base URL

```javascript
VITE_API_URL=http://127.0.0.1:8000
```

### API Modules

**authAPI** - Authentication
- `login(email, password)` - Request OTP
- `register(data)` - Register new user
- `verifyOTP(email, otp)` - Verify OTP and get token
- `logout()` - Logout user

**placesAPI** - Sacred places
- `getAll()` - Get all places
- `getById(id)` - Get single place
- `create(data)` - Create place
- `update(id, data)` - Update place
- `delete(id)` - Delete place

**eventsAPI** - Events management
- `getAll()` - Get all events
- `getById(id)` - Get single event
- `create(data)` - Create event
- `update(id, data)` - Update event
- `delete(id)` - Delete event

**galleryAPI** - Gallery management
- `getAll()` - Get all gallery items
- `getById(id)` - Get single item
- `create(data)` - Upload image
- `update(id, data)` - Update item
- `delete(id)` - Delete item

**usersAPI** - User management
- `getAll()` - Get all users
- `getById(id)` - Get single user
- `create(data)` - Create user
- `update(id, data)` - Update user
- `delete(id)` - Delete user
- `getCurrentUser()` - Get logged-in user info

---

## Environment Variables

```env
# API Configuration
VITE_API_URL=http://127.0.0.1:8000

# Optional: Additional configuration
VITE_APP_NAME=OsamVista
VITE_APP_VERSION=0.1.0
```

---

## Common Tasks

### Add a new page

1. Create file: `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`:
   ```javascript
   <Route path="/my-page" element={<MyPage />} />
   ```
3. Add menu item in `src/utils/menuConfig.js` (if needed)

### Add a new component

1. Create file: `src/components/ui/MyComponent.jsx`
2. Export from `src/components/ui/index.js`:
   ```javascript
   export { default as MyComponent } from './MyComponent'
   ```
3. Use in any page/component:
   ```javascript
   import { MyComponent } from '@/components/ui'
   ```

### Make an API call

```javascript
import { placesAPI } from '@/services/api'

const fetchPlaces = async () => {
  try {
    const response = await placesAPI.getAll()
    console.log(response.data) // Array of places
  } catch (error) {
    console.error('Error:', getErrorMessage(error))
  }
}
```

### Access auth context

```javascript
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useContext(AuthContext)
  
  if (!isAuthenticated) {
    return <button onClick={() => login(email, password)}>Login</button>
  }
  
  return <button onClick={logout}>Logout</button>
}
```

---

## Troubleshooting

### Port 5173 already in use
Vite will automatically try port 5174, 5175, etc. Check the console output for the actual port.

### CORS errors when calling API
Ensure backend is running and CORS is configured. Backend should allow requests from `http://localhost:5173` (or whatever port is in use).

### Token not being sent to API
Check browser DevTools → Network → Headers. Should see `Authorization: Bearer <token>`. If not present, token might not be in localStorage.

### Session expires without logout
This is expected. When token expires on server, the 401 response triggers automatic redirect to login.

### Components not updating after API call
Ensure you're updating state with setState or use proper hooks. API calls should trigger re-renders through state updates.

---

## Performance Tips

1. **Use React.memo()** for components that don't need frequent re-renders
2. **Lazy load pages** using React.lazy() for admin routes
3. **Optimize images** - use proper formats and sizes
4. **Cache API responses** when possible using state/context
5. **Debounce search inputs** to reduce API calls

---

## Production Deployment

```bash
# Build for production
npm run build

# Output: dist/ folder
# Deploy dist/ folder to web server

# For static hosting (Vercel, Netlify, etc.):
# Connect GitHub repo and set build command to: npm run build
# Set base directory to: ui/
```

---

**Created:** January 30, 2026  
**Frontend Version:** 0.1.0  
**Status:** Development Ready
