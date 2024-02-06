import styled from 'styled-components'
import { useCallback, useEffect } from 'react'
import { toast } from '@busmap/components/toast'
import { MapPin } from '@busmap/components/icons/mapPin'
import { Star } from '@busmap/components/icons/star'
import { Bus } from '@busmap/components/icons/bus'
import { Cog } from '@busmap/components/icons/cog'
import { User as UserIcon } from '@busmap/components/icons/user'
import { Exchange } from '@busmap/components/icons/exchange'
import { SignIn } from '@busmap/components/icons/signIn'
import {
  SO,
  SDB,
  PB10T,
  PB70T,
  PB80T,
  PB30T,
  PB50T,
  PB40T,
  PB90T,
  DARK_MODE_FIELD
} from '@busmap/components/colors'

import { touch } from '@core/api/authn.js'
import { useGlobals } from '@core/globals.js'
import { useStorageDispatch } from '@core/contexts/storage.js'
import { useTheme } from '@module/settings/contexts/theme.js'
import { get as getFavorites } from '@module/favorites/api/get.js'

import logoSvg from '../../assets/svg/logo.svg?raw'

import type { FC, MouseEvent } from 'react'
import type { Page, Status } from '@core/types.js'
import type { Mode } from '@busmap/common/types/settings'

interface NavigationProps {
  status?: Status
}

const Nav = styled.nav<{ mode: Mode; isSignedIn: boolean }>`
  position: fixed;
  left: 0;
  height: 100%;
  z-index: 99999;
  background: ${({ mode }) => (mode === 'light' ? PB90T : DARK_MODE_FIELD)};

  ul {
    margin: 0;
    padding: 8px 0 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 48px;
    height: 100%;
  }

  li {
    line-height: 1;
  }

  button {
    background: none;
    border: none;
    padding: 12px;
    color: ${({ mode }) => (mode === 'light' ? PB70T : PB40T)};
    font-size: 11px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    svg {
      color: ${({ mode }) => (mode === 'light' ? PB70T : PB40T)};
    }

    &.active {
      color: ${({ mode }) => (mode === 'light' ? PB30T : PB90T)};

      svg {
        color: ${({ mode }) => (mode === 'light' ? PB30T : PB90T)};
      }
    }

    &:hover {
      cursor: pointer;
      color: ${({ mode }) => (mode === 'light' ? PB30T : PB90T)};

      svg {
        color: ${({ mode }) => (mode === 'light' ? PB30T : PB90T)};
      }
    }

    span:first-child {
      width: 16px;
      height: 16px;
    }

    span:nth-of-type(2) {
      display: none;
    }
  }

  li:first-child {
    button {
      padding: 0;

      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        height: auto;

        svg {
          width: 40px;
          color: ${({ mode }) => (mode === 'light' ? SDB : SO)};

          path.bus {
            fill: ${({ mode }) => (mode === 'light' ? PB90T : DARK_MODE_FIELD)};
          }
        }
      }
    }
  }

  li:nth-child(2) {
    margin: 6px 0;
    border: 1px solid ${({ mode }) => (mode === 'light' ? PB80T : PB50T)};
    border-right: none;
    border-left: none;
    background: ${({ mode }) => (mode === 'light' ? PB30T : PB90T)};
    display: ${({ isSignedIn }) => (isSignedIn ? 'none' : 'list-item')};

    button {
      padding: 5px;
      white-space: nowrap;
      flex-direction: row;
      justify-content: center;
      color: ${({ mode }) => (mode === 'light' ? PB70T : PB40T)};

      span {
        width: auto;
        height: auto;
        font-weight: bold;

        &:last-child {
          width: 10px;
          height: 10px;
        }
      }

      &:hover {
        svg {
          color: ${({ mode }) => (mode === 'light' ? PB70T : PB40T)};
        }
      }
    }

    &.active {
      width: calc(100% + 1px);
      background: ${({ mode }) => (mode === 'light' ? '#fffc' : `${PB10T}cc`)};

      button {
        color: ${({ mode }) => (mode === 'light' ? PB30T : PB90T)};

        svg {
          color: ${({ mode }) => (mode === 'light' ? PB30T : PB90T)};
        }
      }
    }
  }

  li:last-child {
    margin-top: auto;
  }

  li[title='Profile'] {
    display: ${({ isSignedIn }) => (isSignedIn ? 'list-item' : 'none')};
  }

  @media (width >= 431px) and (height >= 536px) {
    ul {
      width: 78px;
    }

    button {
      span:first-child {
        width: 24px;
        height: 24px;
      }

      span:nth-of-type(2) {
        display: block;
      }
    }

    li:first-child button span {
      svg {
        width: 64px;
      }
    }
  }
`
const Navigation: FC<NavigationProps> = ({ status }) => {
  const storageDispatch = useStorageDispatch()
  const { dispatch, page, collapsed, user } = useGlobals()
  const { mode } = useTheme()
  const onClickNavItem = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      const { dataset } = evt.currentTarget

      if (page !== dataset.name) {
        dispatch({ type: 'page', value: dataset.name as Page })
      }

      if (collapsed) {
        dispatch({ type: 'collapsed', value: false })
      }
    },
    [dispatch, page, collapsed]
  )
  const onClickToggle = useCallback(() => {
    dispatch({ type: 'collapsed', value: !collapsed })
  }, [dispatch, collapsed])

  useEffect(() => {
    const getRiderFavs = async () => {
      try {
        const riderFavs = await getFavorites()

        if (riderFavs?.length) {
          storageDispatch({
            type: 'favoriteSet',
            value: riderFavs.map(({ favorite }) => favorite)
          })
        }
      } catch (err) {
        toast({ type: 'error', message: 'Error loading favorites.' })
      }
    }

    if (status?.user) {
      dispatch({ type: 'user', value: status.user })
      getRiderFavs()
    }
  }, [dispatch, storageDispatch, status])

  useEffect(() => {
    const onVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        // Attempt to update session maxAge when window becomes active
        const resp = await touch()

        if (resp.user) {
          dispatch({ type: 'user', value: resp.user })
        }
      }
    }
    const handleNoUserSession = (evt: MessageEvent) => {
      /**
       * If the backend session expires clear the apps
       * user state to require another sign in.
       */
      if (evt.data === 'no-user-session' && user) {
        dispatch({ type: 'user', value: undefined })
        dispatch({ type: 'page', value: 'signin' })
        toast({ type: 'warning', message: 'Your session expired.' })
      }
    }
    const channel = new BroadcastChannel('authn')

    channel.addEventListener('message', handleNoUserSession)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      channel.removeEventListener('message', handleNoUserSession)
      channel.close()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [dispatch, user])

  return (
    <Nav mode={mode} isSignedIn={Boolean(user)}>
      <ul>
        <li title="Busmap">
          <button
            data-name="busmap"
            aria-label="Busmap Logo"
            onClick={onClickNavItem}
            className={page === 'busmap' && !collapsed ? 'active' : undefined}>
            <span dangerouslySetInnerHTML={{ __html: logoSvg }} />
          </button>
        </li>
        <li title="Sign In" className={page === 'signin' ? 'active' : undefined}>
          <button data-name="signin" onClick={onClickNavItem}>
            <span>Sign in</span>
            <SignIn />
          </button>
        </li>
        <li title="Nearby">
          <button
            data-name="locate"
            aria-label="Nearby"
            onClick={onClickNavItem}
            className={page === 'locate' && !collapsed ? 'active' : undefined}>
            <MapPin />
            <span>Nearby</span>
          </button>
        </li>
        <li title="Selector">
          <button
            data-name="select"
            aria-label="Selector"
            onClick={onClickNavItem}
            className={page === 'select' && !collapsed ? 'active' : undefined}>
            <Bus />
            <span>Selector</span>
          </button>
        </li>
        <li title="Favorites">
          <button
            data-name="favorites"
            aria-label="Favorites"
            onClick={onClickNavItem}
            className={page === 'favorites' && !collapsed ? 'active' : undefined}>
            <Star />
            <span>Favorites</span>
          </button>
        </li>
        <li title="Settings">
          <button
            data-name="settings"
            aria-label="Settings"
            onClick={onClickNavItem}
            className={page === 'settings' && !collapsed ? 'active' : undefined}>
            <Cog />
            <span>Settings</span>
          </button>
        </li>
        <li title="Profile">
          <button
            data-name="profile"
            aria-label="Profile"
            onClick={onClickNavItem}
            className={page === 'profile' && !collapsed ? 'active' : undefined}>
            <UserIcon />
            <span>Profile</span>
          </button>
        </li>
        <li>
          <button
            onClick={onClickToggle}
            className={!collapsed ? 'active' : undefined}
            aria-label="Toggle flyout menu">
            <Exchange />
            <span>{collapsed ? 'Open' : 'Close'}</span>
          </button>
        </li>
      </ul>
    </Nav>
  )
}

export { Navigation }
