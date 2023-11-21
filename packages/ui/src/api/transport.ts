import { errors } from './errors.js'

const defaultInit: RequestInit = {
  method: 'GET',
  credentials: 'include'
}
const transport = {
  async fetch<T>(endpoint: string, options: RequestInit = defaultInit) {
    const init = { ...defaultInit, ...options }
    const resp = await fetch(endpoint, init)

    if (!resp.ok) {
      throw errors.create(init.method ?? 'UNKNOWN', resp.status, resp.statusText)
    }

    const data: T = await resp.json()

    return data
  }
}

export { transport }
