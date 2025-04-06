import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  preview: {
    port: 8080,
    host: true,
    allowedHosts: ['kunstcollectie.up.railway.app', 'localhost', '.railway.app', 'projectkunst.nl']
  }
})
