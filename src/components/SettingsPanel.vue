<template>
  <!-- Settings Button -->
  <button
    @click="isOpen = true"
    class="fixed top-6 right-6 p-3 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 z-40"
    aria-label="Open settings"
  >
    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  </button>

  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      @click="closePanel"
    ></div>
  </Transition>

  <!-- Settings Panel -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-full max-w-md bg-slate-800 shadow-2xl z-50 overflow-y-auto"
      role="dialog"
      aria-label="Settings panel"
      @keydown.escape="closePanel"
    >
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-white">Settings</h2>
          <button
            @click="closePanel"
            class="p-2 text-slate-400 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label="Close settings"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <div class="space-y-6">
          <!-- Daily Start Value -->
          <div>
            <label
              for="dailyStart"
              class="block text-sm font-medium text-slate-300 mb-2"
            >
              Daily Start Value
            </label>
            <input
              id="dailyStart"
              v-model="form.dailyStartValue"
              type="number"
              min="1"
              max="100000"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="40000"
            />
            <p class="mt-1 text-sm text-slate-400">
              Number of keepy-upps to start each day
            </p>
          </div>

          <!-- Tick Rate -->
          <div>
            <label
              for="tickRate"
              class="block text-sm font-medium text-slate-300 mb-2"
            >
              Tick Rate (ms per decrement)
            </label>
            <input
              id="tickRate"
              v-model="form.tickRateMs"
              type="number"
              min="50"
              max="5000"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="360"
            />
            <p class="mt-1 text-sm text-slate-400">
              Default: 360ms (1000 per 6 minutes ≈ 2.78/sec)
            </p>
          </div>

          <!-- Counting Mode Toggle -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-3">
              Counting Mode
            </label>
            <div class="flex items-center gap-4">
              <button
                type="button"
                @click="form.bulkMode = false"
                class="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
                :class="
                  !form.bulkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                "
              >
                -1 per tick
              </button>
              <button
                type="button"
                @click="form.bulkMode = true"
                class="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
                :class="
                  form.bulkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                "
              >
                -1000 per 1000 ticks
              </button>
            </div>
            <p class="mt-2 text-sm text-slate-400">
              {{
                form.bulkMode
                  ? "Counter decreases by 1000 after every 1000 intervals"
                  : "Counter decreases by 1 every interval"
              }}
            </p>
          </div>

          <!-- Current Day -->
          <div>
            <label
              for="currentDay"
              class="block text-sm font-medium text-slate-300 mb-2"
            >
              Current Day (1-25)
            </label>
            <input
              id="currentDay"
              v-model="form.currentDay"
              type="number"
              min="1"
              max="25"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1"
            />
          </div>

          <!-- Current Counter -->
          <div>
            <label
              for="currentCounter"
              class="block text-sm font-medium text-slate-300 mb-2"
            >
              Current Counter (Manual Override)
            </label>
            <input
              id="currentCounter"
              v-model="form.counter"
              type="number"
              min="0"
              :max="form.dailyStartValue"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="40000"
            />
          </div>

          <!-- Error Message -->
          <Transition name="fade">
            <div
              v-if="error"
              class="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300"
              role="alert"
            >
              {{ error }}
            </div>
          </Transition>

          <!-- Success Message -->
          <Transition name="fade">
            <div
              v-if="success"
              class="p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-300"
              role="status"
            >
              Settings saved successfully!
            </div>
          </Transition>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              @click="saveSettings"
              class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              💾 Save Changes
            </button>
            <button
              @click="resetToDefaults"
              class="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Reset Defaults
            </button>
          </div>
        </div>

        <!-- Divider -->
        <hr class="my-8 border-slate-700" />

        <!-- Danger Zone -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-red-400">Danger Zone</h3>
          <button
            @click="resetAllData"
            class="w-full px-6 py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-500 text-red-400 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            🗑️ Reset All Data
          </button>
          <p class="text-sm text-slate-500">
            This will clear all progress and start fresh from Day 1.
          </p>
        </div>

        <!-- Info -->
        <div class="mt-8 p-4 bg-slate-700/50 rounded-lg">
          <h4 class="font-medium text-slate-300 mb-2">About</h4>
          <p class="text-sm text-slate-400">
            25-Day Keepy-Upps Challenge<br />
            Track your daily football juggling goals!
          </p>
          <p class="text-sm text-slate-500 mt-2">
            Data is stored locally in your browser.
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useCounterStore } from "../stores/counter";
import { clearState } from "../utils/persistence";

const store = useCounterStore();

const isOpen = ref(false);
const error = ref("");
const success = ref(false);

const form = reactive({
  dailyStartValue: store.dailyStartValue,
  tickRateMs: store.tickRateMs,
  currentDay: store.currentDay,
  counter: store.counter,
  bulkMode: store.bulkMode,
});

// Sync form with store when panel opens
watch(isOpen, (open) => {
  if (open) {
    form.dailyStartValue = store.dailyStartValue;
    form.tickRateMs = store.tickRateMs;
    form.currentDay = store.currentDay;
    form.counter = store.counter;
    form.bulkMode = store.bulkMode;
    error.value = "";
    success.value = false;
  }
});

function closePanel() {
  isOpen.value = false;
}

function validateForm() {
  if (form.dailyStartValue < 1 || form.dailyStartValue > 100000) {
    return "Daily start value must be between 1 and 100,000";
  }
  if (form.tickRateMs < 50 || form.tickRateMs > 5000) {
    return "Tick rate must be between 50ms and 5000ms";
  }
  if (form.currentDay < 1 || form.currentDay > 25) {
    return "Current day must be between 1 and 25";
  }
  if (form.counter < 0 || form.counter > form.dailyStartValue) {
    return `Counter must be between 0 and ${form.dailyStartValue}`;
  }
  return null;
}

function saveSettings() {
  error.value = "";
  success.value = false;

  const validationError = validateForm();
  if (validationError) {
    error.value = validationError;
    return;
  }

  // Pause the timer while updating
  store.pause();

  // Apply settings
  store.setDailyStartValue(form.dailyStartValue);
  store.setTickRateMs(form.tickRateMs);
  store.setDay(form.currentDay);
  store.setCounter(form.counter);
  store.setBulkMode(form.bulkMode);

  success.value = true;
  setTimeout(() => {
    success.value = false;
  }, 2000);
}

function resetToDefaults() {
  form.dailyStartValue = 40000;
  form.tickRateMs = 360;
  form.currentDay = 1;
  form.counter = 40000;
  form.bulkMode = true;
}

function resetAllData() {
  if (
    confirm("Are you sure you want to reset all data? This cannot be undone.")
  ) {
    clearState();
    resetToDefaults();
    saveSettings();
    closePanel();
    // Reload the page to reinitialize
    window.location.reload();
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
