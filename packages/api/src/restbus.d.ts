declare module 'restbus' {
  import type { Router } from 'express'
  import type { Server } from 'node:http'

  interface Restbus {
    listen: (port: number, callback?: () => void) => Server
    middleware: () => Router
  }

  const restbus: Restbus
  export default restbus
}
