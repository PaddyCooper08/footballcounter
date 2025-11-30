import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loadState, saveState, getTodayDateString } from '../utils/persistence'

export const useCounterStore = defineStore('counter', () => {
  // Default settings
  const DEFAULT_DAILY_START = 40000
  const DEFAULT_TICK_RATE_MS = 390 // 1000 keepy-upps / (6.5 * 60 seconds) = 390ms per tick
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
  const bulkMode = ref('hundred') // 'single' = -1 per tick, 'hundred' = -100 per 100 ticks, 'thousand' = -1000 per 1000 ticks
  const tickCounter = ref(0) // tracks ticks in bulk mode

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
      lastTickTimestamp.value = Date.now()
      
      if (bulkMode.value === 'thousand') {
        // Thousand mode: decrement 1000 every 1000 ticks
        tickCounter.value++
        if (tickCounter.value >= 1000) {
          tickCounter.value = 0
          counter.value = Math.max(0, counter.value - 1000)
          isAnimating.value = true
          
          setTimeout(() => {
            isAnimating.value = false
          }, 150)
        }
      } else if (bulkMode.value === 'hundred') {
        // Hundred mode: decrement 100 every 100 ticks
        tickCounter.value++
        if (tickCounter.value >= 100) {
          tickCounter.value = 0
          counter.value = Math.max(0, counter.value - 100)
          isAnimating.value = true
          
          setTimeout(() => {
            isAnimating.value = false
          }, 150)
        }
      } else {
        // Single mode: decrement 1 every tick
        counter.value--
        isAnimating.value = true
        
        setTimeout(() => {
          isAnimating.value = false
        }, 150)
      }

      // Check for completion
      if (counter.value <= 0) {
        counter.value = 0
        isPaused.value = true
        showSuccess.value = true
        tickCounter.value = 0
      }

      // Save state periodically (every 10 ticks to reduce writes)
      if (tickCounter.value % 100 === 0 || counter.value % 10 === 0) {
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

  function setBulkMode(value) {
    if (['single', 'hundred', 'thousand'].includes(value)) {
      bulkMode.value = value
      tickCounter.value = 0 // Reset tick counter when switching modes
      persistState()
    }
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
      bulkMode: bulkMode.value,
      tickCounter: tickCounter.value,
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
        bulkMode.value = saved.bulkMode ?? 'hundred'
        tickCounter.value = saved.tickCounter ?? 0
        
        // If it was running, calculate elapsed ticks
        if (!saved.isPaused && saved.lastTickTimestamp) {
          const elapsed = Date.now() - saved.lastTickTimestamp
          const missedTicks = Math.floor(elapsed / (saved.tickRateMs || DEFAULT_TICK_RATE_MS))
          if (bulkMode.value === 'thousand') {
            // In thousand mode, add missed ticks to counter and calculate decrements
            const totalTicks = tickCounter.value + missedTicks
            const decrements = Math.floor(totalTicks / 1000)
            tickCounter.value = totalTicks % 1000
            counter.value = Math.max(0, counter.value - (decrements * 1000))
          } else if (bulkMode.value === 'hundred') {
            // In hundred mode, add missed ticks to counter and calculate decrements
            const totalTicks = tickCounter.value + missedTicks
            const decrements = Math.floor(totalTicks / 100)
            tickCounter.value = totalTicks % 100
            counter.value = Math.max(0, counter.value - (decrements * 100))
          } else {
            counter.value = Math.max(0, counter.value - missedTicks)
          }
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
    bulkMode,
    tickCounter,
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
    setBulkMode,
    hideSuccess,
    persistState,
    initializeState,
  }
})
