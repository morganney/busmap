import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { MapPin } from '@busmap/components/icons/mapPin'
import { Bus } from '@busmap/components/icons/bus'
import {
  PB10T,
  PB20T,
  PB70T,
  PB40T,
  PB30T,
  PB90T,
  SO,
  SDB
} from '@busmap/components/colors'

import { useStorage } from '@core/contexts/storage.js'
import { useTheme } from '@module/settings/contexts/theme.js'

import { PageTabButton } from './pageTabButton.js'

import logoSvg from '../../assets/svg/logo.svg?raw'

import type { FC } from 'react'
import type { Mode } from '@busmap/common/types/settings'

const Article = styled.article<{ $mode: Mode }>`
  overflow-y: auto;
  max-height: 100%;
  width: 100%;
  position: fixed;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  gap: 24px;
  padding: 16px 8px;

  h5 {
    font-size: 18px;
    font-weight: normal;
    margin: 0;
    display: flex;

    span:first-child {
      display: none;
    }

    span:last-child {
      width: 120px;
      color: ${({ $mode }) => ($mode === 'light' ? SDB : SO)};

      path.bus {
        fill: ${({ $mode }) => ($mode === 'light' ? PB90T : PB20T)};
      }
    }
  }

  p {
    font-weight: 600;
    margin: 0;
    font-size: 1.8rem;

    button {
      text-decoration: underline;
      font-size: 1.8rem;
    }
  }

  ul.busmap-start {
    list-style: none;
    margin: 0;
    background: ${({ $mode }) => ($mode === 'light' ? '#ffffffcc' : `${PB10T}cc`)};
    border: 1px solid ${({ $mode }) => ($mode === 'light' ? PB70T : PB40T)};
    border-radius: 5px;
    padding: 32px 48px;
    display: flex;
    gap: 16px;
    justify-content: space-between;

    button {
      padding: 16px;
      border: 1px solid transparent;
      border-radius: 5px;

      &:hover {
        border-color: ${({ $mode }) => ($mode === 'light' ? PB70T : PB40T)};
      }
    }
  }

  @media (width <= 431px) {
    margin-left: 48px;

    ul.busmap-start {
      flex-direction: column;
    }
  }
`
const ButtonContent = styled.span<{ $mode: Mode }>`
  display: grid;
  justify-items: center;
  gap: 8px;
  color: ${({ $mode }) => ($mode === 'light' ? PB30T : PB90T)};
  font-weight: normal;

  span {
    color: ${({ $mode }) => ($mode === 'light' ? PB30T : PB90T)};
  }
`
const FavsList = styled.ul<{ $mode: Mode }>`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: center;
    gap: 8px;

    > span {
      color: ${({ $mode }) => ($mode === 'light' ? PB30T : PB90T)};
    }
  }

  a {
    display: flex;
    flex-direction: column;
    font-size: 1.4rem;
  }
`
const EmptyMap: FC = () => {
  const { mode } = useTheme()
  const { favorites } = useStorage()

  return (
    <Article id="busmap-empty-map" $mode={mode}>
      <h5>
        <span>Busmap</span>
        <span dangerouslySetInnerHTML={{ __html: logoSvg }} />
      </h5>
      <p>Choose one to get started.</p>
      <ul className="busmap-start">
        <li>
          <PageTabButton page="select">
            <ButtonContent $mode={mode}>
              <Bus />
              <span>Selector</span>
            </ButtonContent>
          </PageTabButton>
        </li>
        <li>
          <PageTabButton page="locate">
            <ButtonContent $mode={mode}>
              <MapPin />
              <span>Nearby</span>
            </ButtonContent>
          </PageTabButton>
        </li>
      </ul>
      {favorites.length ? (
        <>
          <p>Or see some of your favorite stops.</p>
          <FavsList $mode={mode}>
            {favorites.slice(0, 3).map(fav => (
              <li key={fav.stop.id}>
                <Bus />
                <Link
                  to={`/stop/${fav.agency.id}/${fav.route.id}/${fav.direction.id}/${fav.stop.id}`}>
                  <span>{fav.stop.title}</span>
                  <span>{fav.direction.title}</span>
                </Link>
              </li>
            ))}
          </FavsList>
        </>
      ) : (
        <p>
          Or read more <PageTabButton page="busmap">about busmap</PageTabButton>.
        </p>
      )}
    </Article>
  )
}

export { EmptyMap }
