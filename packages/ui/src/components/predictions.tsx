import styled, { keyframes } from 'styled-components'
import { Skeleton } from '@busmap/components/skeleton'
import { PB50T } from '@busmap/components/colors'

import type { FC } from 'react'
import type { Prediction, Stop } from '../types.js'

interface PredictionsProps {
  preds?: Prediction[]
  stop?: Stop
  isFetching: boolean
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
const Direction = styled.p`
  margin: 20px 0 10px 0;
`
const NoArrivals = styled.p`
  margin: 20px 0 0 0;

  em {
    text-decoration: underline;
  }
`
const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;

  li {
    padding: 12px 10px;
    border-bottom: 1px dashed ${PB50T}77;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
  }

  li:last-child {
    border-bottom: none;
  }

  em {
    font-style: normal;
    opacity: 1;
    animation: ${blink} 1.5s linear infinite;
  }

  span {
    display: block;
    font-size: 11px;
  }
`
const Predictions: FC<PredictionsProps> = ({ preds, stop, isFetching = false }) => {
  if (Array.isArray(preds) && stop) {
    if (preds.length) {
      const values = preds[0].values.slice(0, 3)
      const direction = preds[0].values[0].direction.title

      return (
        <>
          <Direction>Arrivals: {direction}</Direction>
          <List>
            {values.map(({ minutes, epochTime }) => (
              <li key={epochTime}>
                {isFetching ? (
                  <Skeleton height="18.5px" />
                ) : minutes === 0 ? (
                  <em key={epochTime}>Arriving</em>
                ) : (
                  <time key={epochTime} dateTime={`PT${minutes}M`}>
                    {minutes} min
                  </time>
                )}
                <span>{stop.title}</span>
              </li>
            ))}
          </List>
        </>
      )
    }

    return (
      <NoArrivals>
        <em>No arrivals</em>: {stop.title}.
      </NoArrivals>
    )
  }

  return null
}

export { Predictions }
