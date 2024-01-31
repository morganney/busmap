import styled, { keyframes } from 'styled-components'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@busmap/components/skeleton'

import { getForStop } from '../api/rb/predictions.js'
import { useGlobals } from '../globals.js'

import type { FC } from 'react'
import type { Popup } from 'leaflet'

interface SelectionProps {
  popup: Popup
  node: HTMLDivElement
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
  font-size: 1.3rem;

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
const Selection: FC<SelectionProps> = ({ popup, node }) => {
  const { selected } = useGlobals()
  const { data, error, isFetching } = useQuery({
    queryKey: ['preds', selected?.agency.id, selected?.route.id, selected?.stop.id],
    queryFn: () => getForStop(selected?.agency.id, selected?.route.id, selected?.stop.id),
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
    enabled: Boolean(selected)
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

  if (!selected) {
    return null
  }

  return createPortal(
    <>
      {error ? (
        <p>
          Unable to retrieve arrival times for this stop.{' '}
          {error instanceof Error ? error.message : 'An unexpected error occured.'}
        </p>
      ) : (
        <Definition>
          <dt>Route</dt>
          <dd>{selected.route.title}</dd>
          <dt>Direction</dt>
          <dd>{selected.direction.title}</dd>
          <dt>Stop</dt>
          <dd>{selected.stop.title}</dd>
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
      )}
    </>,
    node
  )
}

export { Selection }
export type { SelectionProps }
