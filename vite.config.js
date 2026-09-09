import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set this to your GitHub repo name, e.g. '/nexora-registration'
// For a custom domain or user/org page (username.github.io), set base to '/'
const REPO_NAME = '/nexora-registration'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? REPO_NAME : '/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    }
  }
})
