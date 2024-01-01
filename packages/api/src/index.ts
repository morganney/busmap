import { env, exit, uptime } from 'node:process'
import http from 'node:http'

import makeDebug from 'debug'
import errors from 'http-errors'
import express from 'express'
import session from 'express-session'
import RedisStore from 'connect-redis'
import { createClient } from 'redis'
import helmet from 'helmet'
import restbus from 'restbus'
import prexit from 'prexit'

import { sql } from './db.js'
import { logger } from './logger.js'
import { authn } from './routes/authn.js'
import { rider } from './routes/rider.js'
import { favorite } from './routes/favorite.js'
import { authenticated } from './middleware/authenticated.js'
import { error } from './handlers/error.js'
import { SESSION_DURATION_MS } from './common.js'

import type { SessionOptions, CookieOptions } from 'express-session'

const sess: SessionOptions = {
  name: 'busmap.sid',
  secret: env.BM_COOKIE_SECRET as SessionOptions['secret'],
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  proxy: true,
  cookie: {
    maxAge: SESSION_DURATION_MS,
    httpOnly: true,
    secure: env.BM_COOKIE_SECURE === 'true',
    sameSite: (env.BM_COOKIE_SAMESITE as CookieOptions['sameSite']) ?? 'strict'
  }
}
const debug = makeDebug('busmap')
const app = express()
const server = http.createServer(app)
let redisClient: ReturnType<typeof createClient> | null = null

if (env.BM_SESSION_STORE === 'redis') {
  debug('initializing redis store at host', env.BM_REDIS_HOST)
  redisClient = createClient({ url: env.BM_REDIS_HOST })

  try {
    await redisClient.connect()
    /**
     * TTL for the redis session key is derived from `cookie.maxAge` (SESSION_DURATION_MS).
     * Setting `disableTouch` to `true` prevents rolling backend sessions (connect-redis updates the TTL).
     * This is separate from express-session's `rolling` option which controls the client's cookie lifetime.
     *
     * The goal is to keep the client cookie, and redis session expiration synchronized.
     */
    sess.store = new RedisStore({ client: redisClient, disableTouch: true })
  } catch (err) {
    logger.fatal(err, 'Redis client failed to connect. Exiting.')
    exit(1)
  }
}

app.set('trust proxy', 1)

app.use(helmet())
app.use(session(sess))
app.use((req, res, next) => {
  res.set('BUSMAP-SESSION-USER', req.session.user ? 'known' : 'unknown')
  next()
})
app.use('/authn', authn)
app.use('/restbus', restbus.middleware())
app.use('/rider', authenticated, rider)
app.use('/favorite', authenticated, favorite)
app.get('/health', async (req, res) => {
  try {
    if (redisClient && !(redisClient.isOpen && redisClient.isReady)) {
      throw new Error('Redis not healthy.')
    }

    const [row] = await sql<{ now: string }[]>`SELECT now()`

    return res.json({
      timestamp: row.now,
      message: 'OK',
      uptime: uptime()
    })
  } catch (err) {
    return res.status(503).json(new errors.ServiceUnavailable())
  }
})
app.use((req, res) => {
  res.status(404).json(new errors.NotFound())
})
app.use(error.handler)

/**
 * Shutdown gracefully when signal received. Primary signal is SIGTERM
 * when stopping container from process (Docker/Copilot).
 *
 * According to the documentation the container has 10 seconds to shutdown
 * before a SIGKILL is sent.
 * @see https://docs.docker.com/engine/reference/commandline/stop/
 */
prexit(['SIGTERM', 'SIGINT', 'SIGHUP'], async (signal, code, err) => {
  logger.info({ signal, code, err }, 'Server received signal.')

  // Shutdown API server
  server.closeIdleConnections()
  await new Promise(resolve => {
    server.close(error => {
      if (error) {
        logger.warn(`Server not running on ${signal} shutdown.`)
      } else {
        logger.info('Server shut down.')
      }

      resolve('done')
    })
    setTimeout(() => {
      // Force close all connections after the timeout
      server.closeAllConnections()
    }, 5000).unref()
  })

  // Close database connections (timeout is in SECONDS)
  await sql.end({ timeout: 5 })
  logger.info('Database connections closed.')

  // Disconnect redis client
  if (redisClient) {
    await redisClient.quit()
    logger.info('Redis client disconnected.')
  }

  logger.info('Process exiting.')
})

server.listen(3000, () => {
  logger.info('Busmap listening on port 3000...')
})
