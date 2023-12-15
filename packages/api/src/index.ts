import { env, exit } from 'node:process'
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

if (env.BM_SESSION_STORE === 'redis') {
  debug('initializing redis store at host', env.BM_REDIS_HOST)
  const client = createClient({ url: env.BM_REDIS_HOST })

  try {
    await client.connect()
    /**
     * TTL for the redis session key is derived from `cookie.maxAge` (SESSION_DURATION_MS).
     * Setting `disableTouch` to `true` prevents rolling backend sessions (connect-redis updates the TTL).
     * This is separate from express-session's `rolling` option which controls the client's cookie lifetime.
     *
     * The goal is to keep the client cookie, and redis session expiration synchronized.
     */
    sess.store = new RedisStore({ client, disableTouch: true })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Redis client failed to connect: ${err}`)
    exit(1)
  }
}

app.set('trust proxy', 1)

if (env.NODE_ENV === 'production') {
  app.use(morgan('combined'))
}

app.use(helmet())
app.use(session(sess))
app.use((req, res, next) => {
  res.set('BUSMAP-SESSION-USER', req.session.user ? 'known' : 'unknown')
  next()
})
app.use('/authn', authn)
app.use('/restbus', restbus.middleware())
app.use('/favorite', authenticated, favorite)
app.use((req, res) => {
  res.status(404).json(new errors.NotFound())
})
app.use(error.handler)

http.createServer(app).listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port 3000')
})
