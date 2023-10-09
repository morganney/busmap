import styled, { keyframes } from 'styled-components'
import { Skeleton } from '@busmap/components/skeleton'
import { PB50T } from '@busmap/components/colors'

import { PredictedVehiclesColors } from '../utils.js'

import type { FC } from 'react'
import type { Prediction, Stop } from '../types.js'

interface PredictionsProps {
  preds?: Prediction[]
  stop?: Stop
  isFetching: boolean
  timestamp: number
}

const predTextSize = '20px'
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
const Title = styled.h2`
  margin: 20px 0 0 0;
  font-size: 22px;
`
const Timestamp = styled.p`
  margin: 0;
  text-align: center;
  font-size: 12px;
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

    time,
    em {
      line-height: 1;
      font-size: ${predTextSize};
      font-weight: 700;
      text-shadow:
        -0.5px 0 black,
        0 0.5px black,
        0.5px 0 black,
        0 -0.5px black;
    }

    em {
      font-style: normal;
      opacity: 1;
      animation: ${blink} 1.5s linear infinite;
    }

    span {
      font-size: 11px;
    }

    &:first-child {
      time,
      em {
        color: ${PredictedVehiclesColors.green};
      }
    }

    &:last-child {
      border-bottom: none;

      time,
      em {
        color: ${PredictedVehiclesColors.red};
      }
    }

    &:nth-child(2) {
      time,
      em {
        color: ${PredictedVehiclesColors.yellow};
      }
    }
  }
`
const Predictions: FC<PredictionsProps> = ({
  preds,
  stop,
  timestamp,
  isFetching = false
}) => {
  if (Array.isArray(preds) && stop) {
    if (preds.length) {
      const values = preds[0].values.slice(0, 3)
      const title = values[0].isDeparture ? 'Departures' : 'Arrrivals'
      const event = values[0].isDeparture ? 'Departing' : 'Arriving'
      const freshness = new Date(timestamp)

      return (
        <>
          <Title>Next {title}</Title>
          <List>
            {values.map(({ minutes, epochTime, direction }) => (
              <li key={epochTime}>
                {isFetching ? (
                  <Skeleton height={predTextSize} width="25%" />
                ) : minutes === 0 ? (
                  <em key={epochTime}>{event}</em>
                ) : (
                  <time key={epochTime} dateTime={`PT${minutes}M`}>
                    {minutes} min
                  </time>
                )}
                <span>
                  {stop.title} &bull; {direction.title}
                </span>
              </li>
            ))}
          </List>
          <Timestamp>
            Last updated: {freshness.toLocaleDateString()}{' '}
            {freshness.toLocaleTimeString()}
          </Timestamp>
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
