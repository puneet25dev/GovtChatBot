import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Local development proxy only
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  define: {
    // For production, use environment variable
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:4000'),
  },
})
