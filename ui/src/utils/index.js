// Re-export all utilities
export * as StringUtils from './stringUtils'
export * as ValidationUtils from './validationUtils'
export * as ApiUtils from './apiUtils'
export * as CommonUtils from './commonUtils'

// Also export individual functions for convenience
export {
  truncate,
  capitalize,
  slugify,
  formatDate,
  formatTime
} from './stringUtils'

export {
  isEmail,
  isPhoneNumber,
  isStrongPassword,
  isUrl,
  isEmpty
} from './validationUtils'

export {
  buildQueryParams,
  parseApiError,
  getAuthToken,
  setAuthToken,
  removeAuthToken
} from './apiUtils'

export {
  debounce,
  throttle,
  sleep,
  cloneDeep,
  getObjectValue
} from './commonUtils'
