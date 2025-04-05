<!-- components/Cat/CatStatus.vue -->
<template>
  <div
    class="status-container"
    :class="{
      'status-left': statusPosition === 'left',
      'status-right': statusPosition === 'right'
    }"
    :style="{
      top: `${statusY}px`,
      left: statusPosition === 'left' ? `${position.x - 170}px` : `${position.x + 64}px`
    }"
  >
    <div class="status-bubble">
      <div class="status-item">
        <span class="status-label">Happiness:</span>
        <div class="status-bar">
          <div class="status-fill happiness" :style="{ width: `${status.happiness}%` }"></div>
        </div>
      </div>
      <div class="status-item">
        <span class="status-label">Energy:</span>
        <div class="status-bar">
          <div class="status-fill energy" :style="{ width: `${status.energy}%` }"></div>
        </div>
      </div>
      <div class="status-mood">{{ getCurrentMood }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: Object as () => { happiness: number; energy: number },
    required: true
  },
  position: {
    type: Object as () => { x: number; y: number },
    required: true
  },
  statusPosition: {
    type: String,
    default: 'right'
  },
  statusY: {
    type: Number,
    required: true
  }
})

// Get mood text based on happiness
const getCurrentMood = computed(() => {
  const happiness = props.status.happiness
  if (happiness > 80) return 'Purring happily! 😻'
  if (happiness > 60) return 'Content 😺'
  if (happiness > 40) return 'Could use some attention... 😼'
  if (happiness > 20) return 'Feeling neglected 😾'
  return 'Very unhappy! 🙀'
})
</script>

<style scoped>
.status-container {
  position: absolute;
  z-index: 10000;
  pointer-events: none;
}

.status-bubble {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  font-size: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 150px;
  position: relative;
}

.status-left .status-bubble:after {
  content: '';
  position: absolute;
  top: 15px;
  right: -8px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid rgba(0, 0, 0, 0.7);
}

.status-right .status-bubble:after {
  content: '';
  position: absolute;
  top: 15px;
  left: -8px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid rgba(0, 0, 0, 0.7);
}

.status-item {
  margin-bottom: 6px;
}

.status-label {
  display: inline-block;
  width: 70px;
  font-weight: bold;
  font-size: 11px;
  color: #ccc;
}

.status-bar {
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  margin-top: 2px;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.happiness {
  background-color: #ffc107; /* Yellow for happiness */
}

.energy {
  background-color: #2196f3; /* Blue for energy */
}

.status-mood {
  text-align: center;
  margin-top: 8px;
  font-style: italic;
  font-size: 11px;
}
</style>
