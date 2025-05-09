import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import * as path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
  },
  server: {
    host: '0.0.0.0', 
    port: 5173       
  }
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}) 
