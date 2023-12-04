import { env } from 'node:process'

import makeDebug from 'debug'
import error from 'http-errors'
import { OAuth2Client } from 'google-auth-library'

import { sql } from '../db.js'

import type { Request, Response, NextFunction } from 'express'
import type { TokenPayload } from 'google-auth-library'

interface User {
  sub: string
  email: string
  given_name: string
  family_name: string
  full_name: string
}

const debug = makeDebug('busmap')
const authn = {
  async login(req: Request, res: Response) {
    if (req.body.credential) {
      const client = new OAuth2Client()
      let payload: TokenPayload | undefined

      try {
        const ticket = await client.verifyIdToken({
          idToken: req.body.credential,
          audience: env.SSO_GOOG_CLIENT_ID
        })

        payload = ticket.getPayload()
      } catch (err) {
        return res.status(403).json(new error.Forbidden())
      }

      if (payload) {
        const { sub, email, email_verified } = payload

        if (sub && email && email_verified) {
          const { given_name, family_name, name } = payload

          try {
            const userRow = await sql<User[]>`
              INSERT INTO rider
                (sub, email, sso_provider, given_name, family_name, full_name, last_login)
              VALUES
                (${sub}, ${email}, 1, ${given_name ?? ''}, ${family_name ?? ''}, ${
                  name ?? ''
                }, ${new Date().toISOString()})
              ON CONFLICT (sub) DO UPDATE
              SET
                sub = EXCLUDED.sub,
                email = EXCLUDED.email,
                sso_provider = EXCLUDED.sso_provider,
                given_name = EXCLUDED.given_name,
                family_name = EXCLUDED.family_name,
                full_name = EXCLUDED.full_name,
                last_login = EXCLUDED.last_login
              RETURNING
                sub,
                email,
                given_name,
                family_name,
                full_name
            `
            const user = userRow[0]
            const sessUser = {
              sub: user.sub,
              email: user.email,
              givenName: user.given_name,
              familyName: user.family_name,
              fullName: user.full_name,
              maxAge: req.session.cookie.maxAge,
              expires: req.session.cookie.expires
            }

            debug('setting user to session', sessUser)
            req.session.user = sessUser

            return res.json(sessUser)
          } catch (err) {
            return res.status(500).json(new error.InternalServerError())
          }
        }
      }
    }

    return res.status(401).json(new error.Unauthorized())
  },

  logout(req: Request, res: Response, next: NextFunction) {
    const user = req.session.user

    req.session.user = null
    req.session.save(err => {
      if (err) {
        next(err)
      }

      req.session.destroy(err => {
        if (err) {
          next(err)
        } else {
          res.json({
            success: true,
            user: user ?? {}
          })
        }
      })
    })
  },

  status(req: Request, res: Response) {
    if (req.session?.user) {
      return res.json({
        isSignedIn: true,
        user: req.session.user,
        expires: req.session.cookie.expires,
        maxAge: req.session.cookie.maxAge
      })
    }

    res.json({
      isSignedIn: false,
      user: null
    })
  },

  touch(req: Request, res: Response) {
    if (req.session?.user) {
      debug('rolling session from touch')
      req.session.touch()
      req.session.user = {
        ...req.session.user,
        maxAge: req.session.cookie.maxAge,
        expires: req.session.cookie.expires
      }
      debug('updated maxAge', req.session.cookie.maxAge)

      return res.json({ success: true, user: req.session.user, touched: true })
    }

    res.json({ success: true, user: null, touched: false })
  }
}

export { authn }
