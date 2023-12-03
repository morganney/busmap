import { authn } from '@core/channels.js'

import { errors } from './errors.js'

const defaultInit: RequestInit = {
  method: 'GET',
  credentials: 'include',
  headers: new Headers([['Accept', 'application/json']])
}
const transport = {
  async fetch<T>(endpoint: string, options: RequestInit = defaultInit) {
    const init = { ...defaultInit, ...options }

    if (init.body) {
      if (!(init.body instanceof FormData)) {
        /**
         * Only set Content-Type header with `fetch` when not using `FormData`.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sect4
         */
        init.headers = { ...init.headers, 'Content-Type': 'application/json' }

        if (typeof init.body === 'object') {
          init.body = JSON.stringify(init.body)
        }
      }
    }

    const resp = await fetch(endpoint, init)

    if (resp.headers.get('busmap-session-user') === 'inactive') {
      try {
        authn.postMessage('no-user-session')
      } catch {
        /* silent */
      }
    }

    if (!resp.ok) {
      throw errors.create(init.method ?? 'UNKNOWN', resp.status, resp.statusText)
    }

    const data: T = await resp.json()

    return data
  }
}

export { transport }
