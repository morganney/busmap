import { env } from 'node:process'
import http from 'node:http'

import makeDebug from 'debug'
import error from 'http-errors'
import express from 'express'
import session from 'express-session'
import RedisStore from 'connect-redis'
import { createClient } from 'redis'
import morgan from 'morgan'
import helmet from 'helmet'
import restbus from 'restbus'

import type { SessionOptions, CookieOptions } from 'express-session'

const oneDayMs = 86_400_000
const sess: SessionOptions = {
  name: 'busmap.sid',
  secret: env.BM_COOKIE_SECRET as SessionOptions['secret'],
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  cookie: {
    maxAge: oneDayMs,
    httpOnly: true,
    secure: env.BM_COOKIE_SECURE === 'true',
    sameSite: env.BM_COOKIE_SAMESITE as CookieOptions['sameSite'] ?? 'strict'
  }
}
const debug = makeDebug('busmap')
const app = express()

if (env.BM_SESSION_STORE === 'redis') {
  debug('initializing redis store')
  const client = createClient({ url: env.BM_REDIS_HOST })

  try {
    await client.connect()
    // TTL for the redis session keys is derived from cookie.maxAge
    sess.store = new RedisStore({ client })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Redis client failed to connect: ${err}`)
  }
}

app.set('trust proxy', 1)
app.use(env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'))
app.use(helmet())
app.use(session(sess))
app.use('/', (req, res, next) => {
  if (req.session.isInitialized === undefined) {
    req.session.isInitialized = true
    req.session.save(next)
  } else {
    next()
  }
})
app.use(
  '/restbus',
  (req, res, next) => {
    if (req.session.isInitialized) {
      next()
    } else {
      res.status(401).json(new error.Unauthorized())
    }
  },
  restbus.middleware()
)

http.createServer(app).listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port 3000')
})
