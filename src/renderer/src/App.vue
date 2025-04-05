<script setup lang="ts">
// Import the cat image
// import catIcon from 'resources/catIcon.png'

/*
// Add a function to make the window draggable
const handleMouseDown = (event: MouseEvent): void => {
  window.electron.ipcRenderer.send('mouse-down', { x: event.clientX, y: event.clientY })
}
*/

import Cat from './components/Cat.vue'
</script>

<template>
  <div class="app-container">
    <div class="cat-container">
    </div>

    <!-- Add the cat component -->
    <Cat />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: transparent;
}

.cat-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.cat-image {
  width: 100%;     /* Make the image fill the entire container */
  height: 100%;    /* Make the image fill the entire container */
  object-fit: contain; /* Ensures the image maintains its aspect ratio */
  -webkit-user-drag: element;
  cursor: pointer;
}
</style>
