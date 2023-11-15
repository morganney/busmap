import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Bus } from '@busmap/components/icons/bus'

import { useStorage } from '@core/contexts/storage.js'

import type { FC } from 'react'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h3 {
    margin: 0;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 16px;
  }

  li {
    display: flex;
    align-items: center;
    gap: 8px;

    a {
      display: flex;
      flex-direction: column;
      gap: 3px;

      span:last-child {
        font-size: 12px;
      }
    }
  }
`
const FavoritesList: FC = () => {
  const { favorites } = useStorage()

  if (favorites.length) {
    return (
      <Section>
        <h3>See some of your favorites</h3>
        <ul>
          {favorites.slice(0, 3).map((fav, idx) => (
            <li key={idx}>
              <Bus size="large" cursor="auto" />
              <Link
                to={`/stop/${fav.agency.id}/${fav.route.id}/${fav.direction.id}/${fav.stop.id}`}>
                <span>{fav.stop.title}</span>
                <span>{fav.direction.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    )
  }

  return null
}

export { FavoritesList }
