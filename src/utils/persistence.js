const STORAGE_KEY = 'keepy-upps-state'

/**
 * Save state to localStorage
 * @param {Object} state - The state object to save
 */
export function saveState(state) {
  try {
    const serialized = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, serialized)
    return true
  } catch (error) {
    console.error('Failed to save state to localStorage:', error)
    return false
  }
}

/**
 * Load state from localStorage
 * @returns {Object|null} The saved state or null if not found
 */
export function loadState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (serialized === null) {
      return null
    }
    return JSON.parse(serialized)
  } catch (error) {
    console.error('Failed to load state from localStorage:', error)
    return null
  }
}

/**
 * Clear all saved state
 */
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear state from localStorage:', error)
    return false
  }
}

/**
 * Get today's date as a string (YYYY-MM-DD) for day comparison
 * Uses local timezone for day boundaries
 * @returns {string} Date string in YYYY-MM-DD format
 */
export function getTodayDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
export function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}
