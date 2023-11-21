import { env } from 'node:process'
import http from 'node:http'

import error from 'http-errors'
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import helmet from 'helmet'
import restbus from 'restbus'

import type { SessionOptions } from 'express-session'

const oneDayMs = 86_400_000
const sess: SessionOptions = {
  name: 'busmap.sid',
  secret: env.BM_COOKIE_SECRET as string,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  cookie: {
    maxAge: oneDayMs,
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  }
}
const app = express()

app.set('trust proxy', 1)
app.use(env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'))
app.use(helmet())
app.use(session(sess))
app.use((req, res, next) => {
  if (req.session && req.session.isSet === undefined) {
    req.session.isSet = true
  }

  next()
})
app.use(
  '/restbus',
  (req, res, next) => {
    if (req.session?.isSet) {
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
