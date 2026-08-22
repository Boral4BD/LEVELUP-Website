import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serves correctly from https://<user>.github.io/LEVELUP/ (GitHub Pages).
  // Override with BASE_PATH=/ for hosts that serve from the domain root.
  base: process.env.BASE_PATH || '/LEVELUP/',
})
