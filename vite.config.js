import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/ai': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
}) 