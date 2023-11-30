// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SessionData } from 'express-session'

declare module 'express-session' {
  interface SessionData {
    /**
     * Indicates whether the session
     * is new or not, i.e the first time
     * it has been saved to the store (redis).
     */
    isInitialized?: boolean
    /**
     * Whether the session has an authenticated user.
     * If so, this is the JSON.stringify version of
     * a UI User shape.
     */
    user?: string
  }
}
