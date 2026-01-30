/**
 * Common Utilities
 * General-purpose helper functions
 */

export const debounce = (func, delay = 500) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}

export const throttle = (func, limit = 500) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const cloneDeep = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const getObjectValue = (obj, path, defaultValue = null) => {
  const keys = path.split('.')
  let value = obj
  for (const key of keys) {
    value = value?.[key]
  }
  return value ?? defaultValue
}
