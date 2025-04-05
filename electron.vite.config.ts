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
        '#': resolve('src/renderer/src')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@': resolve('src'),
        '#': resolve('src/renderer/src')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '#': resolve('src/renderer/src')
      }
    },
    plugins: [vue(), tailwindcss()]
  }
})
