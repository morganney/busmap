import { useEffect, useRef } from 'react'

import { login } from '@core/api/authn.js'
import { useGlobals } from '@core/globals.js'
import { MAX_FAVORITES } from '@module/favorites/common.js'

import { Page } from './page.js'

import type { FC } from 'react'

const SignIn: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { dispatch } = useGlobals()

  useEffect(() => {
    if (google && ref.current) {
      google.accounts.id.initialize({
        ux_mode: 'popup',
        client_id: import.meta.env.VITE_GOOG_CLIENT_ID,
        nonce: btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))),
        callback: async response => {
          const user = await login(response.credential)

          dispatch({ type: 'user', value: user })
          dispatch({ type: 'page', value: 'profile' })
        }
      })
      google.accounts.id.renderButton(ref.current, {
        type: 'standard',
        click_listener: () => {
          // TODO: Sign in UX
        }
      })
    }
  }, [dispatch])

  return (
    <Page title="Sign In">
      <p>
        Sign in to save your favorite stops and settings across devices. After signing in,
        you can <strong>save more than {MAX_FAVORITES} favorite stops</strong>.
      </p>
      <div ref={ref} />
    </Page>
  )
}

export { SignIn }
