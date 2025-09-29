import { env } from 'node:process'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxy = !env.API_HOST
  ? undefined
  : {
      '/authn': env.API_HOST,
      '/rider': env.API_HOST,
      '/favorite': env.API_HOST,
      '/restbus': env.API_HOST
    }
export default defineConfig({
  envDir: resolve('../..'),
  cacheDir: '/tmp/vite-cache-ui',
  build: {
    target: ['es2022'],
    rollupOptions: {
      output: {
        format: 'es',
        manualChunks: {
          leaflet: ['leaflet'],
          react: ['react', 'react-dom']
        }
      }
    }
  },
  plugins: [
    react({
      babel: {
        babelrc: true,
        configFile: true,
        rootMode: 'upward'
      }
    })
  ],
  server: {
    proxy,
    host: true
  },
  resolve: {
    alias: {
      '@core': resolve('src'),
      '@module': resolve('src/modules')
    }
  },
  preview: { proxy }
})
