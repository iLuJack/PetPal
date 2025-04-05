<script setup lang="ts">
import index from './components/Cat/index.vue'
</script>

<template>
  <div class="app-container">
    <div class="cat-container">
      <index />
    </div>
  </div>
</template>

<style>
.app-container,
.cat-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
