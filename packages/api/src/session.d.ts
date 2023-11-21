// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SessionData } from 'express-session'

declare module 'express-session' {
  interface SessionData {
    isSet?: boolean
  }
}
