// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SessionData } from 'express-session'

declare module 'express-session' {
  interface SessionData {
    /**
     * Whether the session has an authenticated user.
     * If so, this is the JSON.stringify version of
     * a UI User shape.
     */
    user?: string
  }
}
