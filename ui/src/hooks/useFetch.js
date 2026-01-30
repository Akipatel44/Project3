import { useState, useEffect } from 'react'

/**
 * useFetch Hook
 * Fetches data from API and manages loading/error states
 * Usage: const { data, loading, error } = useFetch('/api/places')
 */
export function useFetch(url, options = {}) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        setState({ data, loading: false, error: null })
      } catch (error) {
        setState({ data: null, loading: false, error })
      }
    }

    fetchData()
  }, [url])

  return state
}

export default useFetch
