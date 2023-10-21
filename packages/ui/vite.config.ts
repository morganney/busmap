import { env } from 'node:process'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
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
      host: true,
      proxy: !env.RESTBUS_HOST
        ? undefined
        : {
            '/restbus': {
              target: env.RESTBUS_HOST
            }
          }
    }
  }
})
