import { useEffect } from 'react'

/**
 * useDebounce Hook
 * Debounces a value for a given delay
 * Usage: const debouncedValue = useDebounce(value, 500)
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
