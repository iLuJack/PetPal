// components/Cat/useAnimation.ts
import { ref, computed } from 'vue'

export function useAnimation() {
  const direction = ref('down') // down, right, up, left
  const state = ref('idle') // idle, walking, sleeping, transitioning
  const sleepingPose = ref(0) // 0: sitting, 1: lying down
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

  return {
    direction,
    state,
    sleepingPose,
    animationSpeed,
    ROWS,
    getFrameCount,
    currentAnimationRow
  }
}
