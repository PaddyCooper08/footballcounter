<template>
  <div class="flex flex-col items-center justify-center select-none">
    <!-- Counter Display -->
    <div class="relative" :class="{ 'animate-tick': store.isAnimating }">
      <span
        class="font-mono font-bold text-white text-giant tracking-tight drop-shadow-2xl"
        :class="{
          'text-green-400': store.isComplete,
          'animate-bounce-success': store.showSuccess,
        }"
        role="timer"
        aria-live="polite"
        aria-label="Keepy-upps remaining"
      >
        {{ store.formattedCounter }}
      </span>
    </div>

    <!-- Day Indicator -->
    <p
      class="mt-4 text-2xl md:text-3xl text-slate-400 font-medium tracking-wide"
      aria-label="Current day progress"
    >
      {{ store.dayDisplay }}
    </p>

    <!-- Progress Bar -->
    <div
      class="w-full max-w-2xl mt-6 h-2 bg-slate-700 rounded-full overflow-hidden"
      role="progressbar"
      :aria-valuenow="Math.round(store.progress)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 ease-out"
        :style="{ width: `${store.progress}%` }"
      ></div>
    </div>

    <!-- Status Text -->
    <p class="mt-3 text-lg text-slate-500">
      <span v-if="store.isComplete" class="text-green-400 font-semibold">
        🎉 Daily goal complete!
      </span>
      <span v-else-if="store.isPaused" class="text-yellow-400">
        ⏸️ Paused
      </span>
      <span v-else class="text-blue-400"> ⚽ Counting... </span>
    </p>
  </div>
</template>

<script setup>
import { useCounterStore } from "../stores/counter";

const store = useCounterStore();
</script>
