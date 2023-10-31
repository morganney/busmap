import styled, { keyframes } from 'styled-components'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@busmap/components/skeleton'

import { getForStop } from '../api/rb/predictions.js'

import type { FC } from 'react'
import type { Popup } from 'leaflet'
import type { Agency, Stop, Route, Direction } from '../types.js'

interface SelectionProps {
  agency: Agency
  route: Route
  direction: Direction
  stop: Stop
  popup: Popup
}

const blink = keyframes`
  10% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  40% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
`
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

  dd:last-child {
    display: flex;
    gap: 5px;
    align-items: center;
    white-space: nowrap;

    em {
      font-style: normal;
      opacity: 1;
      animation: ${blink} 1.5s linear infinite;
    }

    em:not(:last-child)::after,
    time:not(:last-child)::after {
      content: ',';
    }
  }
`
const Selection: FC<SelectionProps> = ({ stop, agency, route, direction, popup }) => {
  const { data, error, isFetching } = useQuery({
    queryKey: ['preds', agency.id, route.id, stop.id],
    queryFn: () => getForStop(agency.id, route.id, stop.id),
    refetchOnWindowFocus: true,
    refetchInterval: 10_000
  })
  const arrivals = !data?.length
    ? []
    : /**
       * Given that the agency and route are defined,
       * the first prediction's values should suffice,
       * i.e. no other predictions for different routes,
       * or agencies for the selected stop.
       */
      data[0].values.slice(0, 3).map(({ minutes, epochTime }) => {
        return minutes === 0 ? (
          <em key={epochTime}>Arriving</em>
        ) : (
          <time key={epochTime} dateTime={`PT${minutes}M`}>
            {minutes} min
          </time>
        )
      })

  useEffect(() => {
    if (popup) {
      popup.update()
    }
  }, [popup])

  if (error) {
    const msg = error instanceof Error ? error.message : 'An unexpected error occured.'

    return <p>Unable to retrieve arrival times for this stop. {msg}</p>
  }

  return (
    <Definition>
      <dt>Route</dt>
      <dd>{route.title}</dd>
      <dt>Direction</dt>
      <dd>{direction.title}</dd>
      <dt>Stop</dt>
      <dd>{stop.title}</dd>
      <dt>Arrivals</dt>
      <dd>
        {isFetching ? (
          <Skeleton display="block" />
        ) : arrivals?.length ? (
          arrivals
        ) : (
          'No arrivals'
        )}
      </dd>
    </Definition>
  )
}

export { Selection }
export type { SelectionProps }
