import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    headers: {
      "Content-Security-Policy": "connect-src 'self' https://relate-server-production.up.railway.app",
      "Content-Security-Policy": "default-src 'self'; img-src 'self' data:",
    },
    host: '0.0.0.0',
    port: 5173,
  },
})
