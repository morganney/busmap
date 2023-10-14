/**
 * Start of a stand-alone dev server to decouple vite from production
 * as necessary.
 *
 * Start by running `npm run dev:node -w ui`.
 *
 * Currently not being used, because it is not needed. Vite
 * uses a default `appType` of 'spa' which allows deep-linking/bookmarks
 * out-of-the-box.
 *
 * @see https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server
 */
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

import express from 'express'
import morgan from 'morgan'
import { createServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const start = async () => {
  const server = express()
  const vite = await createServer({
    appType: 'custom',
    server: {
      middlewareMode: true
    }
  })

  server.use(vite.middlewares)
  // Only log requests that get through vite middleware
  server.use(morgan('dev'))
  server.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      let html = readFileSync(resolve(__dirname, 'index.html')).toString()

      html = await vite.transformIndexHtml(url, html)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (err) {
      vite.ssrFixStacktrace(err as Error)
      next(err)
    }
  })

  server.listen(5173, () => {
    // eslint-disable-next-line no-console
    console.log('BusMap dev server listening on port 5173...')
  })
}

start()
