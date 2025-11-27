<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Main Pause/Resume Button -->
    <button
      @click="handleToggle"
      :disabled="store.isComplete"
      class="px-12 py-6 text-3xl font-bold rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      :class="buttonClasses"
      :aria-label="store.isPaused ? 'Resume timer' : 'Pause timer'"
      :aria-pressed="!store.isPaused"
    >
      <span class="flex items-center gap-3">
        <span v-if="store.isComplete">✅ Complete</span>
        <span v-else-if="store.isPaused">
          <svg
            class="w-8 h-8 inline-block mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          Resume
        </span>
        <span v-else>
          <svg
            class="w-8 h-8 inline-block mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
          Pause
        </span>
      </span>
    </button>

    <!-- Reset Button (only shown when paused or complete) -->
    <button
      v-if="store.isPaused || store.isComplete"
      @click="handleReset"
      class="px-6 py-3 text-lg font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
      aria-label="Reset daily counter"
    >
      🔄 Reset Day
    </button>

    <!-- Next Day Button (only shown when complete) -->
    <button
      v-if="store.isComplete && store.currentDay < store.TOTAL_DAYS"
      @click="handleNextDay"
      class="px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Start next day"
    >
      ➡️ Start Day {{ store.currentDay + 1 }}
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCounterStore } from "../stores/counter";

const store = useCounterStore();

const buttonClasses = computed(() => {
  if (store.isComplete) {
    return "bg-gradient-to-r from-green-600 to-emerald-600 text-white focus:ring-green-500";
  }
  if (store.isPaused) {
    return "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white focus:ring-green-500";
  }
  return "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white focus:ring-red-500";
});

function handleToggle() {
  store.togglePause();
}

function handleReset() {
  if (confirm("Are you sure you want to reset today's counter?")) {
    store.resetDay();
  }
}

function handleNextDay() {
  store.nextDay();
}
</script>
