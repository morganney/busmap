import { transport } from './transport.js'

import type { User } from '@core/types.js'

const post = async (credential: string) => {
  const user = await transport.fetch<User>('/authn/login', {
    method: 'POST',
    body: JSON.stringify({ credential })
  })

  return user
}
const get = async () => {
  const status = await transport.fetch<{ isLoggedIn: boolean; user: User | null }>(
    '/authn/status'
  )

  return status
}

export { post, get }
