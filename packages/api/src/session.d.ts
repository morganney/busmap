// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SessionData } from 'express-session'

interface SessionUser {
  sub: string
  email: string
  givenName: string
  familyName: string
  fullName: string
  expires?: string | null | Date
  maxAge?: number | null
}

declare module 'express-session' {
  interface SessionData {
    /**
     * Whether the session has an authenticated user.
     * If so, this is the JSON.stringify version of
     * a UI User shape.
     */
    user?: SessionUser | null
    /**
     * User PK in DB.
     */
    userId?: number
  }
}
