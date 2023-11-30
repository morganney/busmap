import { useEffect, useRef } from 'react'

import { post, get } from '@core/api/authn.js'
import { MAX_FAVORITES } from '@module/favorites/common.js'

import { Page } from './page.js'

import type { FC } from 'react'

const SignIn: FC = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getStatus = async () => {
      // TODO Sign in UX
      await get()
    }

    getStatus()
  }, [])

  useEffect(() => {
    if (google && ref.current) {
      google.accounts.id.initialize({
        ux_mode: 'popup',
        client_id: import.meta.env.VITE_GOOG_CLIENT_ID,
        nonce: btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))),
        callback: async response => {
          await post(response.credential)

          // TODO Sign in UX
        }
      })
      google.accounts.id.renderButton(ref.current, {
        type: 'standard',
        click_listener: () => {
          // TODO: Sign in UX
        }
      })
    }
  }, [])

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
