import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { toast } from '@busmap/components/toast'
import { Loading } from '@busmap/components/loading'
import { PB20T, PB90T } from '@busmap/components/colors'

import { login } from '@core/api/authn.js'
import { useGlobals } from '@core/globals.js'
import { useStorageDispatch } from '@core/contexts/storage.js'
import { useTheme } from '@module/settings/contexts/theme.js'
import { MAX_USER_FAVORITES } from '@module/favorites/common.js'
import { get as getFavorites } from '@module/favorites/api/get.js'

import { Page } from './page.js'

import type { FC } from 'react'
import type { RiderFavoriteItem } from '@busmap/common/types/favorites'

const Note = styled.em`
  font-size: 12px;
`
const SignIn: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { dispatch } = useGlobals()
  const { mode } = useTheme()
  const [riderFavorites, setRiderFavorites] = useState<RiderFavoriteItem[]>()
  const [loading, setLoading] = useState(false)
  const storageDispatch = useStorageDispatch()

  useEffect(() => {
    if (google && ref.current) {
      google.accounts.id.initialize({
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
      google.accounts.id.renderButton(ref.current, {
        type: 'standard',
        click_listener: () => {
          // TODO: Record metrics.
        }
      })
    }
  }, [dispatch, storageDispatch])

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
      {loading ? (
        <p>
          Signing you in <Loading indent={2} color={mode === 'dark' ? PB90T : PB20T} />
        </p>
      ) : (
        <>
          <p>
            Sign in to save your favorite stops and settings across devices. After signing
            in, you can <strong>save up to {MAX_USER_FAVORITES} favorite stops</strong>.
          </p>
          <Note>Requires email verification</Note>
        </>
      )}
      <div ref={ref} />
    </Page>
  )
}

export { SignIn }
