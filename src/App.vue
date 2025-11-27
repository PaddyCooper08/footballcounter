<template>
  <div
    class="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden"
    @keydown.space.prevent="handleSpaceKey"
    tabindex="0"
    ref="appContainer"
  >
    <!-- Main Content -->
    <main
      class="flex-1 flex flex-col items-center justify-center w-full max-w-7xl"
    >
      <!-- Countdown Display -->
      <CountdownDisplay />

      <!-- Pause/Resume Button -->
      <div class="mt-12">
        <PauseButton />
      </div>
    </main>

    <!-- Settings Panel -->
    <SettingsPanel />

    <!-- Confetti Effect -->
    <ConfettiEffect :visible="store.showSuccess" />

    <!-- Footer -->
    <footer class="absolute bottom-4 text-center text-slate-600 text-sm">
      <p>⚽ 31-Day Keepy-Upps Challenge</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref } from "vue";
import { useCounterStore } from "./stores/counter";
import { usePreciseTimer } from "./utils/timer";
import CountdownDisplay from "./components/CountdownDisplay.vue";
import PauseButton from "./components/PauseButton.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import ConfettiEffect from "./components/ConfettiEffect.vue";

const store = useCounterStore();
const appContainer = ref(null);

// Initialize the timer with dynamic tick rate
const timer = usePreciseTimer(
  () => store.tick(),
  () => store.tickRateMs
);

// Watch for pause state changes
watch(
  () => store.isPaused,
  (isPaused) => {
    if (isPaused) {
      timer.stop();
    } else {
      timer.start();
    }
  }
);

// Watch for success to hide it after confetti
watch(
  () => store.showSuccess,
  (show) => {
    if (show) {
      setTimeout(() => {
        store.hideSuccess();
      }, 5000);
    }
  }
);

// Handle spacebar for pause/resume
function handleSpaceKey() {
  if (!store.isComplete) {
    store.togglePause();
  }
}

// Initialize on mount
onMounted(() => {
  // Initialize state from localStorage
  store.initializeState();

  // Start timer if not paused
  if (!store.isPaused && store.counter > 0) {
    timer.start();
  }

  // Focus the app container for keyboard events
  appContainer.value?.focus();
});

// Cleanup on unmount
onUnmounted(() => {
  timer.stop();
  store.persistState();
});
</script>
