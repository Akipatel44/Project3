# React Project Architecture

Scalable, clean architecture following React best practices with proper separation of concerns.

## Folder Structure

```
src/
├── components/
│   ├── common/              # Reusable components used across pages
│   │   ├── Header.jsx       # Global header/navigation
│   │   ├── Footer.jsx       # Global footer
│   │   ├── Loader.jsx       # Loading spinner
│   │   ├── ErrorBoundary.jsx # Error handling wrapper
│   │   └── index.js         # Re-exports for cleaner imports
│   │
│   ├── layout/              # Layout wrapper components
│   │   ├── MainLayout.jsx   # Primary layout with header/footer
│   │   ├── AuthLayout.jsx   # Auth page layout (centered)
│   │   └── index.js
│   │
│   └── ui/                  # Atomic UI components (buttons, inputs, etc.)
│       ├── Button.jsx       # Button component (primary, secondary, danger)
│       ├── Input.jsx        # Input field with label & error states
│       ├── Card.jsx         # Card container with hover effects
│       ├── Modal.jsx        # Modal/dialog component
│       └── index.js
│
├── pages/                   # Page components (routes)
│   ├── Home.jsx
│   ├── Places.jsx
│   ├── Events.jsx
│   ├── Gallery.jsx
│   └── NotFound.jsx
│
├── hooks/                   # Custom React hooks
│   ├── useAsync.js          # Async operation handling
│   ├── useFetch.js          # Data fetching hook
│   ├── useLocalStorage.js   # LocalStorage sync hook
│   ├── useDebounce.js       # Debounce hook
│   └── index.js
│
├── context/                 # Context API providers
│   ├── AuthContext.jsx      # Authentication context
│   ├── ThemeContext.jsx     # Theme (light/dark) context
│   └── index.js
│
├── services/                # API & external services
│   └── api.js               # Axios API client with interceptors
│
├── utils/                   # Utility functions
│   ├── stringUtils.js       # String manipulation
│   ├── validationUtils.js   # Form validation helpers
│   ├── apiUtils.js          # API-related helpers
│   ├── commonUtils.js       # General utilities
│   └── index.js
│
├── assets/                  # Static assets
│   ├── icons/               # Custom SVG icons
│   └── images/              # Images, logos, etc.
│
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Entry point
└── index.css                # Tailwind CSS directives only
```

## Best Practices

### Components

**Common Components** - Highly reusable across entire app
- Examples: Header, Footer, Loader, ErrorBoundary
- Should be stateless or minimally stateful
- Accept props for customization

**Layout Components** - Structural wrappers for pages
- Examples: MainLayout, AuthLayout
- Handle header, footer, sidebar logic
- Wrap page content

**UI Components** - Atomic, single-responsibility components
- Examples: Button, Input, Card, Modal
- Fully reusable and customizable
- Support multiple variants and sizes

### Hooks

Custom hooks extract component logic into reusable functions:

```jsx
// useAsync - Handle async operations
const { data, loading, error, execute } = useAsync(fetchPlaces)

// useFetch - Automatic data fetching
const { data, loading, error } = useFetch('/api/places')

// useLocalStorage - Persist state
const [theme, setTheme] = useLocalStorage('theme', 'light')

// useDebounce - Debounce values
const debouncedSearch = useDebounce(searchQuery, 500)
```

### Context API

Global state management for app-wide concerns:

**AuthContext** - User authentication state
```jsx
const { user, login, logout, isAuthenticated } = useAuth()
```

**ThemeContext** - Theme preference (light/dark)
```jsx
const { theme, toggleTheme } = useTheme()
```

### Utilities

Pure functions for common tasks:

**String Utils**
- `truncate()`, `capitalize()`, `slugify()`
- `formatDate()`, `formatTime()`

**Validation Utils**
- `isEmail()`, `isPhoneNumber()`, `isStrongPassword()`
- `isUrl()`, `isEmpty()`

**API Utils**
- `buildQueryParams()`, `parseApiError()`
- `getAuthToken()`, `setAuthToken()`, `removeAuthToken()`
- `isTokenExpired()`

**Common Utils**
- `debounce()`, `throttle()`, `sleep()`
- `cloneDeep()`, `getObjectValue()`

### Services

API client configuration with:
- Base URL management
- Request/response interceptors
- Authentication token handling
- Pre-configured API methods

```jsx
// Import and use
import { placesAPI, eventsAPI, authAPI } from '@/services/api'

const places = await placesAPI.getAll()
const event = await eventsAPI.getById(id)
await authAPI.login(credentials)
```

## Import Aliases

Configure in `vite.config.js` for cleaner imports:

```jsx
// Instead of: import Button from '../../../components/ui/Button'
import { Button } from '@/components/ui'

// Instead of: import { useAsync } from '../../../hooks/useAsync'
import { useAsync } from '@/hooks'

// Instead of: import { formatDate } from '../../../utils/stringUtils'
import { formatDate } from '@/utils'
```

## Component Template

```jsx
import { motion } from 'framer-motion'
import { SomeIcon } from 'lucide-react'

/**
 * ComponentName
 * Brief description of what this component does
 * Props: prop1 (type), prop2 (type)
 */
export default function ComponentName({ prop1, prop2 = 'default' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Component content */}
    </motion.div>
  )
}
```

## Styling

- **Only Tailwind CSS** - No custom CSS files except `index.css`
- **Custom Classes** - Defined in `src/index.css` using `@layer components`
- **Framer Motion** - For animations and interactions
- **Responsive** - Mobile-first approach with Tailwind breakpoints

## File Naming

- **Components**: PascalCase (.jsx) - `Button.jsx`, `Header.jsx`
- **Hooks**: camelCase with `use` prefix (.js) - `useAsync.js`, `useFetch.js`
- **Utils**: camelCase with descriptive names (.js) - `stringUtils.js`, `validationUtils.js`
- **Services**: camelCase (.js) - `api.js`
- **Context**: PascalCase with `Context` suffix (.jsx) - `AuthContext.jsx`, `ThemeContext.jsx`

## Example Usage

### Creating a Page

```jsx
// src/pages/Places.jsx
import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout'
import { Card, Button } from '@/components/ui'
import { Loader } from '@/components/common'
import { placesAPI } from '@/services/api'
import { formatDate } from '@/utils'

export default function Places() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    placesAPI.getAll()
      .then(setPlaces)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullPage />

  return (
    <MainLayout>
      <div className="container-max py-12">
        <h1 className="text-3xl font-bold mb-8">Sacred Places</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map(place => (
            <Card key={place.id}>
              <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
              <p className="text-gray-600 mb-4">{place.description}</p>
              <Button className="w-full">View Details</Button>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
```

## Next Steps

1. Create additional pages (Places, Events, Gallery)
2. Implement authentication UI (Login, Register)
3. Add form components and validation
4. Create more reusable UI components as needed
5. Implement dark mode using ThemeContext
6. Add comprehensive error handling
7. Create 404 and error pages
