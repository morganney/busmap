import { env } from 'node:process'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const proxy = !env.API_HOST
    ? undefined
    : {
        '/authn': env.API_HOST,
        '/favorite': env.API_HOST,
        '/restbus': env.API_HOST
      }

  return {
    envDir: resolve('../..'),
    build: {
      target: ['chrome118', 'safari16', 'edge118', 'firefox118'],
      rollupOptions: {
        output: {
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
  }
})
