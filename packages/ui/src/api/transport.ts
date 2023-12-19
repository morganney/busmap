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

    if (resp.headers.get('busmap-session-user') === 'unknown') {
      try {
        authn.postMessage('no-user-session')
      } catch {
        /* silent */
      }
    }

    if (!resp.ok) {
      throw errors.create(init.method ?? 'UNKNOWN', resp.status, resp.statusText)
    }

    /**
     * HTTP 204 implies no content.
     *
     * Requires considering responses of type `undefined`
     * when using this module. Consider creating more
     * cohesive transports associated with HTTP verbs
     * if this becomes bad DX for GET requests.
     */
    if (resp.status !== 204) {
      const data: T = await resp.json()

      return data
    }
  }
}

export { transport }
