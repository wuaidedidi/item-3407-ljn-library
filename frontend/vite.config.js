import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://ljn-library-backend:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://ljn-library-backend:8080',
        changeOrigin: true,
      }
    }
  }
})
