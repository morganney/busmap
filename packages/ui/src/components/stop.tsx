import styled from 'styled-components'
import { Skeleton } from '@busmap/components/skeleton'

import type { FC } from 'react'
import type { Stop, Route } from '../types.js'

interface StopProps {
  stop?: Stop
  route?: Route
  direction?: string
  arrivals?: string[]
  isLoading?: boolean
}

const Definition = styled.dl`
  display: grid;
  grid-template-rows: repeat(3, max-content);
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;

  dt,
  dd {
    margin: 0;
    padding: 0;
    padding: 1px 2px;
  }

  dt {
    text-align: right;
    font-weight: 700;
  }

  dt::after {
    content: ':';
  }
`
const Stop: FC<StopProps> = ({ stop, route, direction, arrivals, isLoading = false }) => {
  return (
    <Definition>
      <dt>Route</dt>
      <dd>{route?.title}</dd>
      <dt>Direction</dt>
      <dd>{direction}</dd>
      <dt>Stop</dt>
      <dd>{stop?.title}</dd>
      <dt>Arrivals</dt>
      <dd>
        {isLoading ? (
          <Skeleton display="block" />
        ) : arrivals?.length ? (
          arrivals?.join(', ')
        ) : (
          'No arrivals'
        )}
      </dd>
    </Definition>
  )
}

export { Stop }
