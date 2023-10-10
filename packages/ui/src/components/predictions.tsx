import styled, { keyframes } from 'styled-components'
import { PB50T, PB80T } from '@busmap/components/colors'

import { PredictedVehiclesColors } from '../utils.js'

import type { FC } from 'react'
import type { Prediction, Stop } from '../types.js'

interface PredictionsProps {
  preds?: Prediction[]
  stop?: Stop
  isFetching: boolean
  timestamp: number
  markPredictedVehicles: boolean
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
const Section = styled.section`
  margin: 0;
`
const Title = styled.h2`
  margin: 0;
  font-size: 22px;
`
const Timestamp = styled.p`
  margin: 0;
  text-align: center;
  font-size: 10px;
`
const NoArrivals = styled.p`
  margin: 20px 0 0 0;

  em {
    text-decoration: underline;
  }
`
const List = styled.ul<{ markPredictedVehicles: boolean }>`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;

  li {
    padding: 12px 0;
    border-bottom: 1px dashed ${PB50T}77;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;

    time,
    em {
      line-height: 1;
      font-size: 20px;
      font-weight: 700;

      sup {
        font-size: 14px;
      }
    }

    em {
      font-style: normal;
      opacity: 1;
      animation: ${blink} 1.5s linear infinite;
    }

    span {
      font-size: 12px;
    }

    &:first-child {
      time,
      em {
        color: ${({ markPredictedVehicles }) =>
          markPredictedVehicles ? PredictedVehiclesColors.green : 'inherit'};
      }
    }

    &:last-child {
      border-bottom: none;

      time,
      em {
        color: ${({ markPredictedVehicles }) =>
          markPredictedVehicles ? PredictedVehiclesColors.red : 'inherit'};
      }
    }

    &:nth-child(2) {
      time,
      em {
        color: ${({ markPredictedVehicles }) =>
          markPredictedVehicles ? PredictedVehiclesColors.yellow : 'inherit'};
      }
    }
  }
`
const AffectedByLayover = styled.details`
  margin: 0 0 12px 0;
  summary:first-of-type {
    font-size: 12px;
  }
  p {
    line-height: 1.25;
    margin: 12px 0;
    padding: 12px;
    font-size: 14px;
    background: white;
    border-radius: 4px;
    border: 1px solid ${PB80T};
  }
`
const Predictions: FC<PredictionsProps> = ({
  preds,
  stop,
  timestamp,
  markPredictedVehicles = true
}) => {
  if (Array.isArray(preds) && stop) {
    if (preds.length) {
      const values = preds[0].values.slice(0, 3)
      const title = values[0].isDeparture ? 'Departures' : 'Arrivals'
      const event = values[0].isDeparture ? 'Departing' : 'Arriving'
      const affectedByLayover = values.find(value => value.affectedByLayover)
      const freshness = new Date(timestamp)

      return (
        <Section>
          <Title>Next {title}</Title>
          <List markPredictedVehicles={markPredictedVehicles}>
            {values.map(({ minutes, epochTime, direction, affectedByLayover }) => (
              <li key={epochTime}>
                {minutes === 0 ? (
                  <em key={epochTime}>{event}</em>
                ) : (
                  <time key={epochTime} dateTime={`PT${minutes}M`}>
                    {minutes} min{affectedByLayover && <sup>*</sup>}
                  </time>
                )}
                <span>
                  {stop.title} &bull; {direction.title}
                </span>
              </li>
            ))}
          </List>
          {affectedByLayover && (
            <AffectedByLayover>
              <summary>
                Affected by layover<sup>*</sup>
              </summary>
              <p>
                Specifies whether the predictions are based not just on the position of
                the vehicle and the expected travel time, but also on whether a vehicle
                leaves a terminal at the configured layover time. This information can be
                useful to passengers because predictions that are affected by a layover
                will not be as accurate.
              </p>
            </AffectedByLayover>
          )}
          <Timestamp>
            Last updated: {freshness.toLocaleDateString()}{' '}
            {freshness.toLocaleTimeString()}
          </Timestamp>
        </Section>
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
