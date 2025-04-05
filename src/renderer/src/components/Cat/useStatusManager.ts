// components/Cat/useStatusManager.ts
import { ref, onMounted, onUnmounted, Ref } from 'vue'

type StatusDeps = {
  state: Ref<string>
  isPaused: Ref<boolean>
}

export function useStatusManager({ state, isPaused }: StatusDeps) {
  // Cat status
  const catStatus = ref({
    happiness: 85, // 0-100 percentage
    energy: 70 // 0-100 percentage
  })

  // Status changes over time
  function updateStatus() {
    // Don't update status when paused/hovered
    if (isPaused.value) return

    // Decrease happiness and energy slightly over time
    if (state.value === 'sleeping') {
      // Recover energy while sleeping
      catStatus.value.energy = Math.min(100, catStatus.value.energy + 0.5)
      // But get slightly bored/less happy
      catStatus.value.happiness = Math.max(40, catStatus.value.happiness - 0.1)
    } else if (state.value === 'walking') {
      // Lose energy while walking
      catStatus.value.energy = Math.max(10, catStatus.value.energy - 0.2)
      // Walking makes cat slightly happier
      catStatus.value.happiness = Math.min(95, catStatus.value.happiness + 0.1)
    } else {
      // Idle state
      catStatus.value.happiness = Math.max(50, catStatus.value.happiness - 0.05)
    }
  }

  // Call updateStatus periodically
  let statusInterval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    // Start status updates
    statusInterval = setInterval(updateStatus, 1000)
  })

  onUnmounted(() => {
    if (statusInterval) clearInterval(statusInterval)
  })

  return {
    catStatus
  }
}
