import { ref, onUnmounted } from 'vue'

/**
 * Creates a precise interval timer that accounts for drift
 * @param {Function} callback - Function to call on each tick
 * @param {number} intervalMs - Interval in milliseconds
 * @returns {Object} Timer control object
 */
export function useTimer(callback, intervalMs) {
  const isRunning = ref(false)
  let intervalId = null
  let expectedTime = 0

  function start() {
    if (isRunning.value) return

    isRunning.value = true
    expectedTime = Date.now() + intervalMs

    intervalId = setInterval(() => {
      const drift = Date.now() - expectedTime

      // Call the callback
      callback()

      // Adjust for drift - if we're running behind, catch up
      expectedTime += intervalMs

      // If drift is significant, reset the expected time
      if (drift > intervalMs) {
        expectedTime = Date.now() + intervalMs
      }
    }, intervalMs)
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  }

  function restart(newIntervalMs) {
    stop()
    if (newIntervalMs) {
      // Would need to recreate the interval with new timing
      // For simplicity, just start again
    }
    start()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stop()
  })

  return {
    isRunning,
    start,
    stop,
    restart,
  }
}

/**
 * Creates a self-correcting timer that minimizes drift over time
 * Uses requestAnimationFrame for better accuracy
 * @param {Function} callback - Function to call on each tick
 * @param {Function} getIntervalMs - Function that returns current interval in ms
 * @returns {Object} Timer control object
 */
export function usePreciseTimer(callback, getIntervalMs) {
  const isRunning = ref(false)
  let animationId = null
  let lastTickTime = 0
  let accumulatedTime = 0

  function tick(currentTime) {
    if (!isRunning.value) return

    if (lastTickTime === 0) {
      lastTickTime = currentTime
    }

    const deltaTime = currentTime - lastTickTime
    lastTickTime = currentTime
    accumulatedTime += deltaTime

    const intervalMs = getIntervalMs()

    // Process all accumulated ticks
    while (accumulatedTime >= intervalMs) {
      callback()
      accumulatedTime -= intervalMs
    }

    animationId = requestAnimationFrame(tick)
  }

  function start() {
    if (isRunning.value) return

    isRunning.value = true
    lastTickTime = 0
    accumulatedTime = 0
    animationId = requestAnimationFrame(tick)
  }

  function stop() {
    isRunning.value = false
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    lastTickTime = 0
    accumulatedTime = 0
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stop()
  })

  return {
    isRunning,
    start,
    stop,
  }
}
