<!-- components/Cat/index.vue -->
<template>
  <div class="cat-wrapper">
    <!-- Status display that appears on hover -->
    <CatStatus
      v-if="isHovered"
      :status="catStatus"
      :position="position"
      :statusPosition="statusPosition"
      :statusY="statusY"
    />

    <!-- Cat sprite -->
    <CatSprite
      :position="position"
      :currentAnimationRow="currentAnimationRow"
      :frameCount="getFrameCount"
      :animationSpeed="animationSpeed"
      :isPaused="isPaused"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CatSprite from './CatSprite.vue'
import CatStatus from './CatStatus.vue'
import { useAnimation } from './useAnimation'
import { useMovement } from './useMovement'
import { useStatusManager } from './useStatusManager'

// Screen dimensions with padding for boundaries
const screenWidth = ref(window.innerWidth)
const screenHeight = ref(window.innerHeight)
console.log('Screen dimensions:', screenWidth.value, screenHeight.value)
const CAT_WIDTH = 64
const CAT_HEIGHT = 64
const BOUNDARY_PADDING = 100

// Hover and UI state
const isHovered = ref(false)
const isPaused = ref(false)
const statusPosition = ref('right')
const statusY = ref(0)

// Safe area calculations
const getMinX = () => BOUNDARY_PADDING
const getMaxX = () => screenWidth.value - CAT_WIDTH - BOUNDARY_PADDING
const getMinY = () => BOUNDARY_PADDING
const getMaxY = () => screenHeight.value - CAT_HEIGHT - BOUNDARY_PADDING

// Store initial dimensions
let initialWidth = 0
let initialHeight = 0

// Fix position initialization order - Move this BEFORE updateDimensions call
const position = ref({
  x: 0, // Start near the top-left with good margins
  y: 0
})
console.log('Initial position set:', position.value)

// Update dimensions function
const updateDimensions = () => {
  // Only set dimensions once on first call
  if (initialWidth === 0) {
    initialWidth = window.innerWidth
    initialHeight = window.innerHeight
    console.log('Setting initial dimensions:', initialWidth, initialHeight)
  }

  // Always use initial dimensions
  screenWidth.value = initialWidth
  screenHeight.value = initialHeight

  console.log('Boundary limits:', {
    minX: getMinX(),
    maxX: getMaxX(),
    minY: getMinY(),
    maxY: getMaxY()
  })

  // Log before adjustment
  console.log('Position before adjustment:', { ...position.value })

  // If cat is outside bounds after resize, move it back
  position.value.x = Math.max(getMinX(), Math.min(getMaxX(), position.value.x))
  position.value.y = Math.max(getMinY(), Math.min(getMaxY(), position.value.y))

  // Log after adjustment
  console.log('Position after adjustment:', { ...position.value })
}

// Call once immediately
updateDimensions()

// Do NOT update on resize to avoid the fluctuating dimensions problem
// window.addEventListener('resize', updateDimensions)

// Clean up event listener
onUnmounted(() => {
  // window.removeEventListener('resize', updateDimensions)
})

// Import composables
const { state, direction, sleepingPose, currentAnimationRow, animationSpeed, getFrameCount, ROWS } =
  useAnimation()

const { walkTo, sleep, randomBehavior } = useMovement({
  position,
  state,
  direction,
  isPaused,
  getMinX,
  getMaxX,
  getMinY,
  getMaxY
})

const { catStatus } = useStatusManager({ state, isPaused })

// Handle mouse interactions
function handleMouseEnter() {
  // Determine if status should appear on left or right
  if (position.value.x > screenWidth.value - 220) {
    statusPosition.value = 'left'
  } else {
    statusPosition.value = 'right'
  }

  // Calculate vertical position to keep status on screen
  statusY.value = Math.min(Math.max(10, position.value.y - 20), screenHeight.value - 120)

  isHovered.value = true
  isPaused.value = true
}

function handleMouseLeave() {
  isHovered.value = false
  isPaused.value = false

  // Resume cat behavior after pause
  setTimeout(() => {
    if (!isHovered.value) {
      randomBehavior()
    }
  }, 500)
}

// Start the cat's behaviors
onMounted(() => {
  console.log('Component mounted, position:', { ...position.value })
  console.log('Window dimensions in mount:', window.innerWidth, window.innerHeight)

  // Start with a short delay
  setTimeout(() => {
    console.log('Starting behaviors, position before:', { ...position.value })
    randomBehavior()
  }, 1000)
})
</script>

<style scoped>
.cat-wrapper {
  position: relative;
}
</style>
