// src/renderer/src/components/Cat.vue
<template>
  <div
    class="cat"
    :style="{
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: `scale(2)` /* Scale for size */
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <SpriteAnimation
      :sprite-sheet="catSpriteSheet"
      :frame-width="32"
      :frame-height="32"
      :frame-count="getFrameCount"
      :animation-speed="animationSpeed"
      :row="currentAnimationRow"
      :is-playing="isAnimating"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SpriteAnimation from './SpriteAnimation.vue'

// Import cat sprite sheet
import catSpriteSheet from '../assets/cat-sheet-orange.png'

// Cat state
const position = ref({ x: 100, y: 100 })
const direction = ref('down') // down, right, up, left
const state = ref('idle') // idle, walking, sleeping, transitioning
const sleepingPose = ref(0) // 0: sitting, 1: lying down
const isAnimating = ref(true)
const animationSpeed = ref(200)

// Animation rows based on the sprite sheet
const ROWS = {
  WALK_DOWN: 0,
  WALK_RIGHT: 1,
  WALK_UP: 2,
  WALK_LEFT: 3,
  SLEEP_SITTING_1: 4,
  SLEEP_SITTING_2: 5,
  TRANSITIONING: 6,
  SLEEP_LYING: 7
}

// Number of frames per animation
const frameCountMap = {
  walking: 4, // 4 frames for walking
  sleeping: 2, // 2 frames for sleeping animations
  transitioning: 4 // 4 frames for transition animation
}

// Determine frame count based on current state
const getFrameCount = computed(() => {
  if (state.value === 'walking') return frameCountMap.walking
  if (state.value === 'transitioning') return frameCountMap.transitioning
  if (state.value === 'sleeping') return frameCountMap.sleeping
  return 1 // Default for idle
})

// Determine which row to use
const currentAnimationRow = computed(() => {
  if (state.value === 'walking') {
    // Select the correct row based on direction
    switch (direction.value) {
      case 'down':
        return ROWS.WALK_DOWN
      case 'right':
        return ROWS.WALK_RIGHT
      case 'up':
        return ROWS.WALK_UP
      case 'left':
        return ROWS.WALK_LEFT
      default:
        return ROWS.WALK_DOWN
    }
  } else if (state.value === 'sleeping') {
    return sleepingPose.value === 0
      ? Math.random() > 0.5
        ? ROWS.SLEEP_SITTING_1
        : ROWS.SLEEP_SITTING_2 // Alternate between sitting poses
      : ROWS.SLEEP_LYING // Lying down pose
  } else if (state.value === 'transitioning') {
    return ROWS.TRANSITIONING
  } else {
    // Idle state - use the first frame of walking in current direction
    switch (direction.value) {
      case 'down':
        return ROWS.WALK_DOWN
      case 'right':
        return ROWS.WALK_RIGHT
      case 'up':
        return ROWS.WALK_UP
      case 'left':
        return ROWS.WALK_LEFT
      default:
        return ROWS.WALK_DOWN
    }
  }
})

// Make the cat region interactive when hovering (optional)
function handleMouseEnter() {
  // Uncomment this if you want interactivity on hover
  // window.electron.ipcRenderer.send('toggle-interaction', false)
}

function handleMouseLeave() {
  // window.electron.ipcRenderer.send('toggle-interaction', true)
}

// Screen bounds
const screenBounds = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Update screen bounds on resize
window.addEventListener('resize', () => {
  screenBounds.width = window.innerWidth
  screenBounds.height = window.innerHeight
})

// Movement functions
function walkTo(x: number, y: number, callback?: () => void) {
  // Ensure target is within screen bounds
  x = Math.max(0, Math.min(screenBounds.width - 64, x))
  y = Math.max(0, Math.min(screenBounds.height - 64, y))

  // Determine direction based on target position
  const dx = x - position.value.x
  const dy = y - position.value.y

  if (Math.abs(dx) > Math.abs(dy)) {
    direction.value = dx > 0 ? 'right' : 'left'
  } else {
    direction.value = dy > 0 ? 'down' : 'up'
  }

  state.value = 'walking'
  animationSpeed.value = 200

  // Simple animation to move towards the target
  const moveInterval = setInterval(() => {
    const moveX = dx !== 0 ? (dx > 0 ? 2 : -2) : 0
    const moveY = dy !== 0 ? (dy > 0 ? 2 : -2) : 0

    position.value.x += moveX
    position.value.y += moveY

    // Check if we've reached or passed the target
    if ((dx > 0 && position.value.x >= x) || (dx < 0 && position.value.x <= x) || dx === 0) {
      position.value.x = x
    }

    if ((dy > 0 && position.value.y >= y) || (dy < 0 && position.value.y <= y) || dy === 0) {
      position.value.y = y
    }

    // Stop once we reach the target
    if (position.value.x === x && position.value.y === y) {
      clearInterval(moveInterval)
      state.value = 'idle'
      if (callback) callback()
    }
  }, 32) // ~30fps
}

function sleep() {
  // First transition to sleeping
  state.value = 'transitioning'
  animationSpeed.value = 300

  // After transition animation completes
  setTimeout(() => {
    state.value = 'sleeping'
    sleepingPose.value = Math.random() > 0.5 ? 0 : 1 // Randomly choose sitting or lying down
    animationSpeed.value = 800 // Slower animation for sleeping

    // Wake up after some time
    setTimeout(
      () => {
        state.value = 'idle'
        animationSpeed.value = 200
      },
      5000 + Math.random() * 5000
    ) // Sleep for 5-10 seconds
  }, 1200) // Time for transition animation to complete
}

// Random behaviors
function randomBehavior() {
  const choice = Math.random()

  if (choice < 0.7) {
    // 70% chance to walk
    const randomX = Math.max(
      0,
      Math.min(screenBounds.width - 64, Math.random() * screenBounds.width)
    )
    const randomY = Math.max(
      0,
      Math.min(screenBounds.height - 64, Math.random() * screenBounds.height)
    )
    walkTo(randomX, randomY, () => {
      setTimeout(randomBehavior, 1000 + Math.random() * 2000)
    })
  } else {
    // 30% chance to sleep
    sleep()
    setTimeout(randomBehavior, 8000 + Math.random() * 4000)
  }
}

// Start the cat's behaviors
onMounted(() => {
  // Start with a short delay
  setTimeout(randomBehavior, 1000)
})
</script>

<style scoped>
.cat {
  will-change: transform, left, top;
  z-index: 9999;
  cursor: pointer;
}
</style>
