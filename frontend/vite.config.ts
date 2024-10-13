import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import unocss from 'unocss/vite'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), unocss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
