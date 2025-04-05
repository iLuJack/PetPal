// src/renderer/src/components/SpriteAnimation.vue
<template>
  <div
    class="sprite-container"
    :style="{
      width: `${frameWidth}px`,
      height: `${frameHeight}px`,
      backgroundImage: `url(${spriteSheet})`,
      backgroundPosition: `${-currentFrame * frameWidth}px ${-currentRow * frameHeight}px`
    }"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  spriteSheet: {
    type: String,
    required: true
  },
  frameWidth: {
    type: Number,
    required: true
  },
  frameHeight: {
    type: Number,
    required: true
  },
  frameCount: {
    type: Number,
    required: true
  },
  animationSpeed: {
    type: Number,
    default: 200 // ms per frame
  },
  row: {
    type: Number,
    default: 0
  },
  isPlaying: {
    type: Boolean,
    default: true
  }
})

const currentFrame = ref(0)
const currentRow = ref(props.row)
let animationInterval: number | null = null

const startAnimation = () => {
  if (animationInterval) return

  animationInterval = window.setInterval(() => {
    currentFrame.value = (currentFrame.value + 1) % props.frameCount
  }, props.animationSpeed)
}

const stopAnimation = () => {
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}

watch(
  () => props.isPlaying,
  (isPlaying) => {
    if (isPlaying) {
      startAnimation()
    } else {
      stopAnimation()
    }
  }
)

watch(
  () => props.row,
  (newRow) => {
    currentRow.value = newRow
  }
)

onMounted(() => {
  if (props.isPlaying) {
    startAnimation()
  }
})

onUnmounted(() => {
  stopAnimation()
})
</script>

<style scoped>
.sprite-container {
  display: inline-block;
  image-rendering: pixelated; /* Keep pixel art crisp */
}
</style>
