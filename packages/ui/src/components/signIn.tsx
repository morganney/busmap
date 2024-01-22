import { useEffect, useRef, useState } from 'react'
import { toast } from '@busmap/components/toast'

import { login } from '@core/api/authn.js'
import { useGlobals } from '@core/globals.js'
import { useStorageDispatch } from '@core/contexts/storage.js'
import { MAX_USER_FAVORITES } from '@module/favorites/common.js'
import { get as getFavorites } from '@module/favorites/api/get.js'

import { Page } from './page.js'
import { Dots } from './dots.js'

import type { FC } from 'react'
import type { RiderFavoriteItem } from '@busmap/common/types/favorites'

const SignIn: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { dispatch } = useGlobals()
  const [riderFavorites, setRiderFavorites] = useState<RiderFavoriteItem[]>()
  const [loading, setLoading] = useState(false)
  const [gsiLoaded, setGsiLoaded] = useState(false)
  const storageDispatch = useStorageDispatch()

  useEffect(() => {
    const script = document.createElement('script')

    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.addEventListener('load', () => {
      setGsiLoaded(true)
    })
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (gsiLoaded && window.google && ref.current) {
      window.google.accounts.id.initialize({
        ux_mode: 'popup',
        client_id: import.meta.env.VITE_GOOG_CLIENT_ID,
        nonce: btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))),
        callback: async response => {
          setLoading(true)

          if (ref.current) {
            ref.current.style.setProperty('display', 'none')
          }

          try {
            const user = await login(response.credential)
            const riderFavs = await getFavorites()

            dispatch({ type: 'user', value: user })
            dispatch({ type: 'page', value: 'profile' })
            storageDispatch({ type: 'settingsChanged', value: user.settings })
            storageDispatch({ type: 'favoriteReset' })
            setRiderFavorites(riderFavs)
          } catch (err) {
            toast({ type: 'error', message: 'Error signing in.' })
          } finally {
            setLoading(false)

            if (ref.current) {
              ref.current.style.setProperty('display', 'block')
            }
          }
        }
      })
      window.google.accounts.id.renderButton(ref.current, {
        type: 'standard',
        click_listener: () => {
          // TODO: Record metrics.
        }
      })
    }
  }, [gsiLoaded, dispatch, storageDispatch])

  useEffect(() => {
    if (riderFavorites?.length) {
      storageDispatch({
        type: 'favoriteSet',
        value: riderFavorites.map(({ favorite }) => favorite)
      })
    }
  }, [storageDispatch, riderFavorites])

  return (
    <Page title="Sign In">
      {!gsiLoaded ? (
        <Dots />
      ) : loading ? (
        <p>
          Signing you in <Dots />
        </p>
      ) : (
        <>
          <p>Sign in with Google to save your favorite stops and settings.</p>
          <p>
            You will also be able to{' '}
            <strong>save up to {MAX_USER_FAVORITES} favorite stops</strong> after signing
            in.
          </p>
        </>
      )}
      <div ref={ref} />
    </Page>
  )
}

export { SignIn }
