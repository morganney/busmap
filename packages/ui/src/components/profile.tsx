import styled from 'styled-components'
import { useCallback, useState } from 'react'
import { toast } from '@busmap/components/toast'

import { logout } from '@core/api/authn.js'
import { useGlobals } from '@core/globals.js'

import { Page } from './page.js'

import type { FC } from 'react'

const SignOut = styled.button`
  cursor: pointer;
`
const Profile: FC = () => {
  const { user, dispatch } = useGlobals()
  const [loading, setLoading] = useState(false)
  const onClickSignOut = useCallback(async () => {
    setLoading(true)

    try {
      const result = await logout()

      dispatch({ type: 'page', value: 'locate' })
      dispatch({ type: 'user', value: undefined })
      toast({ type: 'info', message: `Goodbye ${result.user.givenName ?? ''}.` })
    } catch {
      toast({ type: 'error', message: 'Error signing out!' })
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  if (!user) {
    return null
  }

  return (
    <Page title="Profile">
      <p>
        Hi <strong>{user.givenName}</strong>. You are currently signed in.
      </p>
      <SignOut disabled={loading} onClick={onClickSignOut}>
        Sign out
      </SignOut>
    </Page>
  )
}

export { Profile }
