import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@': resolve('src'),
        '$': resolve('.'),
        '@assets': resolve('resources')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@': resolve('src'),
        '$': resolve('.'),
        '@assets': resolve('resources')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src'),
        '$': resolve('.'),
        '@assets': resolve('resources')
      }
    },
    plugins: [
      vue(),
      tailwindcss()
    ]
  }
})
