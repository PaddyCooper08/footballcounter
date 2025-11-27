import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loadState, saveState, getTodayDateString } from '../utils/persistence'

export const useCounterStore = defineStore('counter', () => {
  // Default settings
  const DEFAULT_DAILY_START = 40000
  const DEFAULT_TICK_RATE_MS = 360 // 1000 keepy-upps / (6 * 60 seconds) ≈ 360ms per tick
  const TOTAL_DAYS = 25

  // State
  const counter = ref(DEFAULT_DAILY_START)
  const currentDay = ref(1)
  const isPaused = ref(true)
  const dailyStartValue = ref(DEFAULT_DAILY_START)
  const tickRateMs = ref(DEFAULT_TICK_RATE_MS)
  const lastTickTimestamp = ref(Date.now())
  const challengeStartDate = ref('')
  const isAnimating = ref(false)
  const showSuccess = ref(false)

  // Computed
  const formattedCounter = computed(() => {
    return counter.value.toLocaleString()
  })

  const progress = computed(() => {
    return ((dailyStartValue.value - counter.value) / dailyStartValue.value) * 100
  })

  const dayDisplay = computed(() => {
    return `Day ${currentDay.value}/${TOTAL_DAYS}`
  })

  const isComplete = computed(() => {
    return counter.value <= 0
  })

  // Actions
  function tick() {
    if (!isPaused.value && counter.value > 0) {
      counter.value--
      lastTickTimestamp.value = Date.now()
      isAnimating.value = true
      
      // Reset animation flag after animation completes
      setTimeout(() => {
        isAnimating.value = false
      }, 150)

      // Check for completion
      if (counter.value <= 0) {
        counter.value = 0
        isPaused.value = true
        showSuccess.value = true
      }

      // Save state periodically (every 10 ticks to reduce writes)
      if (counter.value % 10 === 0) {
        persistState()
      }
    }
  }

  function togglePause() {
    isPaused.value = !isPaused.value
    lastTickTimestamp.value = Date.now()
    persistState()
  }

  function pause() {
    isPaused.value = true
    persistState()
  }

  function resume() {
    if (counter.value > 0) {
      isPaused.value = false
      lastTickTimestamp.value = Date.now()
      persistState()
    }
  }

  function resetDay() {
    counter.value = dailyStartValue.value
    isPaused.value = true
    showSuccess.value = false
    lastTickTimestamp.value = Date.now()
    persistState()
  }

  function nextDay() {
    if (currentDay.value < TOTAL_DAYS) {
      currentDay.value++
      resetDay()
    }
  }

  function setCounter(value) {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 0 && num <= dailyStartValue.value) {
      counter.value = num
      showSuccess.value = num <= 0
      persistState()
      return true
    }
    return false
  }

  function setDay(value) {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 1 && num <= TOTAL_DAYS) {
      currentDay.value = num
      persistState()
      return true
    }
    return false
  }

  function setDailyStartValue(value) {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num > 0 && num <= 100000) {
      dailyStartValue.value = num
      persistState()
      return true
    }
    return false
  }

  function setTickRateMs(value) {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 50 && num <= 5000) {
      tickRateMs.value = num
      persistState()
      return true
    }
    return false
  }

  function hideSuccess() {
    showSuccess.value = false
  }

  function persistState() {
    saveState({
      counter: counter.value,
      currentDay: currentDay.value,
      isPaused: isPaused.value,
      dailyStartValue: dailyStartValue.value,
      tickRateMs: tickRateMs.value,
      lastTickTimestamp: lastTickTimestamp.value,
      challengeStartDate: challengeStartDate.value,
      lastDateString: getTodayDateString(),
    })
  }

  function initializeState() {
    const saved = loadState()
    const todayStr = getTodayDateString()

    if (saved) {
      // Check if it's a new day
      if (saved.lastDateString && saved.lastDateString !== todayStr) {
        // It's a new day - calculate how many days have passed
        const lastDate = new Date(saved.lastDateString)
        const today = new Date(todayStr)
        const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
        
        // Advance the day counter
        const newDay = Math.min(saved.currentDay + daysDiff, TOTAL_DAYS)
        currentDay.value = newDay
        
        // Reset counter for new day
        counter.value = saved.dailyStartValue || DEFAULT_DAILY_START
        dailyStartValue.value = saved.dailyStartValue || DEFAULT_DAILY_START
        tickRateMs.value = saved.tickRateMs || DEFAULT_TICK_RATE_MS
        isPaused.value = true
        challengeStartDate.value = saved.challengeStartDate || todayStr
      } else {
        // Same day - restore state
        counter.value = saved.counter ?? DEFAULT_DAILY_START
        currentDay.value = saved.currentDay ?? 1
        dailyStartValue.value = saved.dailyStartValue ?? DEFAULT_DAILY_START
        tickRateMs.value = saved.tickRateMs ?? DEFAULT_TICK_RATE_MS
        challengeStartDate.value = saved.challengeStartDate || todayStr
        
        // If it was running, calculate elapsed ticks
        if (!saved.isPaused && saved.lastTickTimestamp) {
          const elapsed = Date.now() - saved.lastTickTimestamp
          const missedTicks = Math.floor(elapsed / (saved.tickRateMs || DEFAULT_TICK_RATE_MS))
          counter.value = Math.max(0, counter.value - missedTicks)
        }
        
        isPaused.value = saved.isPaused ?? true
        showSuccess.value = counter.value <= 0
      }
    } else {
      // First time - initialize with defaults
      challengeStartDate.value = todayStr
    }

    lastTickTimestamp.value = Date.now()
    persistState()
  }

  // Watch for beforeunload to save state
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      persistState()
    })
  }

  return {
    // State
    counter,
    currentDay,
    isPaused,
    dailyStartValue,
    tickRateMs,
    lastTickTimestamp,
    isAnimating,
    showSuccess,
    TOTAL_DAYS,

    // Computed
    formattedCounter,
    progress,
    dayDisplay,
    isComplete,

    // Actions
    tick,
    togglePause,
    pause,
    resume,
    resetDay,
    nextDay,
    setCounter,
    setDay,
    setDailyStartValue,
    setTickRateMs,
    hideSuccess,
    persistState,
    initializeState,
  }
})
