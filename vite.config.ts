import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base is set to /gamified_compiler/ for GitHub Pages deployment
// In local dev (npm run dev), GITHUB_ACTIONS is unset so base stays '/'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.GITHUB_ACTIONS ? '/gamified_compiler/' : '/',
})

