import { env } from 'node:process'
import http from 'node:http'

import makeDebug from 'debug'
import errors from 'http-errors'
import express from 'express'
import session from 'express-session'
import RedisStore from 'connect-redis'
import { createClient } from 'redis'
import morgan from 'morgan'
import helmet from 'helmet'
import restbus from 'restbus'

import { authn } from './routes/authn.js'
import { error } from './handlers/error.js'

import type { SessionOptions, CookieOptions } from 'express-session'

const oneHourMs = 3_600_000
const sess: SessionOptions = {
  name: 'busmap.sid',
  secret: env.BM_COOKIE_SECRET as SessionOptions['secret'],
  resave: false,
  saveUninitialized: true,
  unset: 'destroy',
  cookie: {
    maxAge: 12 * oneHourMs,
    httpOnly: true,
    secure: env.BM_COOKIE_SECURE === 'true',
    sameSite: (env.BM_COOKIE_SAMESITE as CookieOptions['sameSite']) ?? 'strict'
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

if (env.NODE_ENV === 'production') {
  app.use(morgan('combined'))
}

app.use(helmet())
app.use(session(sess))
app.use('/authn', authn)
app.use('/restbus', restbus.middleware())
app.use((req, res) => {
  res.status(404).json(new errors.NotFound())
})
app.use(error.handler)

http.createServer(app).listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port 3000')
})
