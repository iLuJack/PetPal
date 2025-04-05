// components/Cat/useMovement.ts
import { Ref } from 'vue'

type MovementDeps = {
  position: Ref<{ x: number; y: number }>
  state: Ref<string>
  direction: Ref<string>
  isPaused: Ref<boolean>
  getMinX: () => number
  getMaxX: () => number
  getMinY: () => number
  getMaxY: () => number
}

export function useMovement({
  position,
  state,
  direction,
  isPaused,
  getMinX,
  getMaxX,
  getMinY,
  getMaxY
}: MovementDeps) {
  // Movement control
  let moveInterval: ReturnType<typeof setInterval> | null = null

  // Movement functions
  function walkTo(x: number, y: number, callback?: () => void) {
    console.log('walkTo called with target:', x, y)
    console.log('Current position:', { ...position.value })
    console.log('Boundaries:', {
      minX: getMinX(),
      maxX: getMaxX(),
      minY: getMinY(),
      maxY: getMaxY()
    })

    // Don't start walking if paused
    if (isPaused.value) return

    // Enforce boundaries
    x = Math.max(getMinX(), Math.min(getMaxX(), x))
    y = Math.max(getMinY(), Math.min(getMaxY(), y))

    // Clear any existing movement
    if (moveInterval) {
      clearInterval(moveInterval)
    }

    // Determine direction based on target position
    const dx = x - position.value.x
    const dy = y - position.value.y

    if (Math.abs(dx) > Math.abs(dy)) {
      direction.value = dx > 0 ? 'right' : 'left'
    } else {
      direction.value = dy > 0 ? 'down' : 'up'
    }

    state.value = 'walking'

    // Simple animation to move towards the target
    moveInterval = setInterval(() => {
      // Log position in each frame
      console.log('Animation frame position:', { ...position.value })

      // Stop if paused
      if (isPaused.value) {
        clearInterval(moveInterval!)
        moveInterval = null
        return
      }

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
        clearInterval(moveInterval!)
        moveInterval = null
        state.value = 'idle'
        if (callback) callback()
      }

      // After updating position
      position.value.x = Math.max(getMinX(), Math.min(getMaxX(), position.value.x))
      position.value.y = Math.max(getMinY(), Math.min(getMaxY(), position.value.y))
    }, 32) // ~30fps
  }

  function sleep() {
    // Don't start sleeping transition if paused
    if (isPaused.value) return

    // First transition to sleeping
    state.value = 'transitioning'

    // After transition animation completes
    const sleepTimer = setTimeout(() => {
      // Check if still relevant
      if (isPaused.value) return

      state.value = 'sleeping'

      // Wake up after some time
      const wakeTimer = setTimeout(
        () => {
          // Check if still relevant
          if (isPaused.value) return

          state.value = 'idle'

          // Start next behavior
          randomBehavior()
        },
        5000 + Math.random() * 5000
      ) // Sleep for 5-10 seconds
    }, 1200) // Time for transition animation to complete
  }

  // Random behaviors
  function randomBehavior() {
    console.log('randomBehavior called, current position:', { ...position.value })

    // Don't start new behavior if paused
    if (isPaused.value) return

    const choice = Math.random()

    if (choice < 0.7) {
      // 70% chance to walk
      // Use only the middle 50% of the screen for safety
      const centerX = (getMinX() + getMaxX()) / 2
      const centerY = (getMinY() + getMaxY()) / 2
      const rangeX = (getMaxX() - getMinX()) * 0.5
      const rangeY = (getMaxY() - getMinY()) * 0.5

      const randomX = centerX + (Math.random() * rangeX - rangeX / 2)
      const randomY = centerY + (Math.random() * rangeY - rangeY / 2)

      console.log('Calculated bounds:', {
        centerX,
        centerY,
        rangeX,
        rangeY
      })
      console.log('Random target position:', randomX, randomY)

      walkTo(randomX, randomY, () => {
        if (!isPaused.value) {
          setTimeout(randomBehavior, 1000 + Math.random() * 2000)
        }
      })
    } else {
      // 30% chance to sleep
      sleep()
    }
  }

  return {
    walkTo,
    sleep,
    randomBehavior
  }
}
