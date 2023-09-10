import { errors } from './errors.js'

const defaultInit = {
  method: 'GET'
}
const transport = {
  async fetch<T>(endpoint: string, options: RequestInit = defaultInit) {
    const init = { ...defaultInit, ...options }
    const resp = await fetch(endpoint, init)

    if (!resp.ok) {
      throw errors.create(init.method, resp.status, resp.statusText)
    }

    const data: T = await resp.json()

    return data
  }
}

export { transport }
