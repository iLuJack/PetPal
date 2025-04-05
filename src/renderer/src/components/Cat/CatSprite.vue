<!-- components/Cat/CatSprite.vue -->
<template>
  <div
    class="cat"
    :style="{
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: `scale(2)`
    }"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <SpriteAnimation
      :sprite-sheet="catSpriteSheet"
      :frame-width="32"
      :frame-height="32"
      :frame-count="frameCount"
      :animation-speed="animationSpeed"
      :row="currentAnimationRow"
      :is-playing="!isPaused"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, watch } from 'vue'
import SpriteAnimation from '../SpriteAnimation.vue'
import catSpriteSheet from '../../assets/cat-sheet-orange.png'

const props = defineProps({
  position: {
    type: Object as () => { x: number; y: number },
    required: true
  },
  currentAnimationRow: {
    type: Number,
    required: true
  },
  frameCount: {
    type: Number,
    required: true
  },
  animationSpeed: {
    type: Number,
    required: true
  },
  isPaused: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  console.log('CatSprite mounted with position:', props.position)
  console.log('Sprite sheet loaded:', catSpriteSheet)
})

// Track position changes
watch(
  () => props.position,
  (newPos) => {
    console.log('CatSprite position updated:', newPos)
  },
  { deep: true }
)

defineEmits(['mouseenter', 'mouseleave'])
</script>

<style scoped>
.cat {
  will-change: transform, left, top;
  z-index: 9999;
  cursor: pointer;
}
</style>
