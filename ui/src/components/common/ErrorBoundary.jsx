import { Component } from 'react'
import { AlertCircle } from 'lucide-react'

/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 * Usage: <ErrorBoundary><MyComponent /></ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h1 className="text-xl font-bold text-red-600">Error</h1>
            </div>
            <p className="text-gray-600 mb-4">
              Something went wrong. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
