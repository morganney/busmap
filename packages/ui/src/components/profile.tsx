import styled from 'styled-components'
import { useCallback, useState } from 'react'
import { toast } from '@busmap/components/toast'
import { Button } from '@busmap/components/button'
import { SignOut } from '@busmap/components/icons/signOut'
import { PB80T, PB20T, PB90T } from '@busmap/components/colors'

import { logout } from '@core/api/authn.js'
import { useGlobals } from '@core/globals.js'
import { useStorageDispatch } from '@core/contexts/storage.js'
import { useTheme } from '@module/settings/contexts/theme.js'

import { Page } from './page.js'
import { Dots } from './dots.js'

import type { FC } from 'react'
import type { Mode } from '@busmap/common/types/settings'

const SignOutBtn = styled.button<{ $mode: Mode }>`
  cursor: pointer;
  background: none;
  font-weight: bold;
  border: none;
  margin: 0 0 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $mode }) => ($mode === 'light' ? PB20T : PB90T)};

  span:last-child {
    color: ${({ $mode }) => ($mode === 'light' ? PB20T : PB90T)};
  }
`
const ProviderBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 15px;
  border: 1px solid ${PB80T};
  border-radius: 5px;
  font-size: 14px;
  margin: 8px 0 0;

  p {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  span:first-child {
    padding: 5px;
    border: 1px solid ${PB80T};
    display: flex;
  }

  span:last-child {
    font-weight: 600;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`
const Profile: FC = () => {
  const { mode } = useTheme()
  const { user, dispatch } = useGlobals()
  const dispatchStorage = useStorageDispatch()
  const [loading, setLoading] = useState(false)
  const onClickSignOut = useCallback(async () => {
    setLoading(true)

    try {
      const result = await logout()

      dispatch({ type: 'page', value: 'locate' })
      dispatch({ type: 'user', value: undefined })
      dispatchStorage({ type: 'favoriteReset' })
      toast({ type: 'info', message: `Goodbye ${result.user.givenName ?? ''}.` })
    } catch {
      toast({ type: 'error', message: 'Error signing out!' })
    } finally {
      setLoading(false)
    }
  }, [dispatch, dispatchStorage])
  const onClickDisconnect = useCallback(() => {
    if (user && google) {
      setLoading(true)
      // TODO: Do not logout. Instead open modal explaining they will need to re-connect next sign in.
      google.accounts.id.revoke(user.sub, async resp => {
        if (resp.error) {
          setLoading(false)
          toast({ type: 'error', message: 'Error disconnecting Google.' })
        }

        if (resp.successful) {
          try {
            await logout()

            dispatch({ type: 'page', value: 'locate' })
            dispatch({ type: 'user', value: undefined })
            toast({ type: 'info', message: 'Google disconnected. Goodbye.' })
          } catch {
            toast({ type: 'error', message: 'Error signing out.' })
          } finally {
            setLoading(false)
          }
        }
      })
    }
  }, [dispatch, user])

  if (!user) {
    return null
  }

  return (
    <Page title="Profile">
      <p>
        Hi <strong>{user.givenName}</strong>. Have a good ride.
      </p>
      <div>
        <p>Your Busmap sign in provider.</p>
        <ProviderBlock>
          <p>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  fill="#4285f4"
                  d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z"></path>
                <path
                  fill="#34a853"
                  d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z"></path>
                <path
                  fill="#fbbc02"
                  d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z"></path>
                <path
                  fill="#ea4335"
                  d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"></path>
              </svg>
            </span>
            <span>Google</span>
          </p>
          <Button display={mode} onClick={onClickDisconnect} isDisabled={loading}>
            Disconnect
          </Button>
        </ProviderBlock>
      </div>
      <div>
        {loading ? (
          <p>
            Signing you out <Dots />
          </p>
        ) : (
          <SignOutBtn $mode={mode} disabled={loading} onClick={onClickSignOut}>
            <span>Sign out</span>
            <SignOut size="small" />
          </SignOutBtn>
        )}
      </div>
    </Page>
  )
}

export { Profile }
