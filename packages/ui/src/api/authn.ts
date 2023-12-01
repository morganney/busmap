import { transport } from './transport.js'

import type { User, Status } from '@core/types.js'

const login = async (credential: string) => {
  const user = await transport.fetch<User>('/authn/login', {
    method: 'POST',
    body: JSON.stringify({ credential })
  })

  return user
}
const status = async () => {
  const status = await transport.fetch<Status>('/authn/status')

  return status
}
const logout = async () => {
  const result = await transport.fetch<{ success: boolean; user: User }>(
    '/authn/logout',
    {
      method: 'POST'
    }
  )

  return result
}

export { login, status, logout }
