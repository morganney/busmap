import styled from 'styled-components'
import { useCallback } from 'react'
import { MapPin } from '@busmap/components/icons/mapPin'
import { Star } from '@busmap/components/icons/star'
import { Bus } from '@busmap/components/icons/bus'
import { Cog } from '@busmap/components/icons/cog'
import { InfoCircle } from '@busmap/components/icons/infoCircle'
import { Exchange } from '@busmap/components/icons/exchange'
import {
  SO,
  SDB10S,
  PB70T,
  PB80T,
  PB30T,
  PB50T,
  PB40T,
  PB90T,
  DARK_MODE_FIELD
} from '@busmap/components/colors'

import { useGlobals } from '@core/globals.js'
import { useTheme } from '@module/settings/contexts/theme.js'

import logoSvg from '../../assets/svg/logo.svg?raw'

import type { FC, MouseEvent } from 'react'
import type { Page } from '@core/types.js'
import type { Mode } from '@module/settings/types.js'

const Nav = styled.nav<{ mode: Mode }>`
  position: relative;
  z-index: 9999;
  background: ${({ mode }) => (mode === 'light' ? PB90T : DARK_MODE_FIELD)};
  border-right: 1px solid ${({ mode }) => (mode === 'light' ? PB80T : PB50T)};

  ul {
    margin: 0;
    padding: 12px 0 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
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
    font-size: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    svg {
      color: ${({ mode }) => (mode === 'light' ? PB70T : PB40T)};
    }

    &.active {
      color: ${({ mode }) => (mode === 'light' ? PB30T : `${PB90T}`)};

      svg {
        color: ${({ mode }) => (mode === 'light' ? PB30T : `${PB90T}`)};
      }
    }

    &:hover {
      cursor: pointer;
      color: ${({ mode }) => (mode === 'light' ? PB30T : `${PB90T}`)};

      svg {
        color: ${({ mode }) => (mode === 'light' ? PB30T : `${PB90T}`)};
      }
    }

    span:first-child {
      width: 16px;
      height: 16px;
    }

    span:last-child {
      display: none;
    }
  }

  li:first-child {
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${({ mode }) => (mode === 'light' ? SDB10S : SO)};

      svg {
        width: 40px;

        path.bus {
          fill: ${({ mode }) => (mode === 'light' ? PB90T : DARK_MODE_FIELD)};
        }
      }
    }
  }

  li:last-child {
    margin-top: auto;

    button {
      color: ${({ mode }) => (mode === 'light' ? PB30T : PB90T)};

      svg {
        color: ${({ mode }) => (mode === 'light' ? PB30T : PB90T)};
      }
    }
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

      span:last-child {
        display: block;
      }
    }

    li:first-child a {
      svg {
        width: 64px;
      }
    }
  }
`
const Navigation: FC = () => {
  const { dispatch, page, collapsed } = useGlobals()
  const { mode } = useTheme()
  const onClick = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      const { dataset } = evt.currentTarget

      dispatch({ type: 'page', value: dataset.name as Page })
    },
    [dispatch]
  )
  const onClickToggle = useCallback(() => {
    dispatch({ type: 'collapsed', value: !collapsed })
  }, [dispatch, collapsed])

  return (
    <Nav mode={mode}>
      <ul>
        <li>
          <a href="/" title="BusMap">
            <span dangerouslySetInnerHTML={{ __html: logoSvg }} />
          </a>
        </li>
        <li title="Nearby Stops">
          <button
            data-name="locate"
            onClick={onClick}
            className={page === 'locate' ? 'active' : undefined}>
            <MapPin />
            <span>Nearby Stops</span>
          </button>
        </li>
        <li title="Bus Selector">
          <button
            data-name="select"
            onClick={onClick}
            className={page === 'select' ? 'active' : undefined}>
            <Bus />
            <span>Bus Selector</span>
          </button>
        </li>
        <li title="Favorites">
          <button
            data-name="favorites"
            onClick={onClick}
            className={page === 'favorites' ? 'active' : undefined}>
            <Star />
            <span>Favorites</span>
          </button>
        </li>
        <li title="Settings">
          <button
            data-name="settings"
            onClick={onClick}
            className={page === 'settings' ? 'active' : undefined}>
            <Cog />
            <span>Settings</span>
          </button>
        </li>
        <li title="Map Info">
          <button
            data-name="info"
            onClick={onClick}
            className={page === 'info' ? 'active' : undefined}>
            <InfoCircle />
            <span>Map Info</span>
          </button>
        </li>
        <li>
          <button onClick={onClickToggle}>
            <Exchange />
            <span>{collapsed ? 'Open' : 'Close'}</span>
          </button>
        </li>
      </ul>
    </Nav>
  )
}

export { Navigation }
