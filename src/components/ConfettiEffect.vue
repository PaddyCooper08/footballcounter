<template>
  <Teleport to="body">
    <Transition name="confetti-fade">
      <div
        v-if="visible"
        class="fixed inset-0 pointer-events-none z-50"
        aria-hidden="true"
      >
        <!-- Canvas will be inserted here by confetti library -->
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from "vue";
import confetti from "canvas-confetti";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

let confettiInstance = null;

function fireConfetti() {
  const duration = 4000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Football-themed colors: white, black, green (pitch)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ["#ffffff", "#1e293b", "#22c55e", "#eab308"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ["#ffffff", "#1e293b", "#22c55e", "#eab308"],
    });
  }, 250);

  confettiInstance = interval;
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fireConfetti();
    }
  }
);

onUnmounted(() => {
  if (confettiInstance) {
    clearInterval(confettiInstance);
  }
});
</script>

<style scoped>
.confetti-fade-enter-active,
.confetti-fade-leave-active {
  transition: opacity 0.5s ease;
}

.confetti-fade-enter-from,
.confetti-fade-leave-to {
  opacity: 0;
}
</style>
