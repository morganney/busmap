import styled from 'styled-components'
import { PB50T, PB80T, PB70T } from '@busmap/components/colors'

import { useTheme } from '@module/settings/contexts/theme.js'
import { useVehicleSettings } from '@module/settings/contexts/vehicle.js'
import { usePredictionsSettings } from '@module/settings/contexts/predictions.js'
import { UserLocator } from '@module/location/components/userLocator.js'

import { VehicleLocator } from './vehicleLocator.js'

import { PredictedVehiclesColors, blinkStyles } from '../common.js'

import type { FC } from 'react'
import type { Mode } from '@module/settings/types.js'
import type { Prediction, Stop, Route } from '../types.js'

interface PredictionsProps {
  preds?: Prediction[]
  stop?: Stop
  route?: Route
  locateActive: boolean
  isFetching: boolean
  timestamp: number
  messages: Prediction['messages']
}
interface FormatProps {
  epochTime: number
  affectedByLayover: boolean
  minutes: number
}
const Section = styled.section`
  margin: 0;

  header {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin: 0 0 12px;

    h2 {
      margin: 0;
      font-size: 22px;
    }

    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: normal;
      line-height: 1;
    }
  }
`
const Timestamp = styled.p`
  margin: 0;
  text-align: center;
  font-size: 10px;
`
const NoArrivals = styled.p`
  margin: 20px 0 0;

  em {
    text-decoration: underline;
  }
`
const List = styled.ul<{ markPredictedVehicles: boolean; mode: Mode }>`
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

    time {
      text-transform: lowercase;
    }

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
      ${blinkStyles};
    }

    span {
      font-size: 12px;
      color: ${({ mode }) => (mode === 'light' ? 'inherit' : PB70T)};
    }

    &:last-child {
      border-bottom: none;

      time,
      em {
        color: ${({ markPredictedVehicles }) =>
          markPredictedVehicles ? PredictedVehiclesColors.red : 'inherit'};
      }
    }

    &:first-child {
      time,
      em {
        color: ${({ markPredictedVehicles }) =>
          markPredictedVehicles ? PredictedVehiclesColors.green : 'inherit'};
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
const AffectedByLayover = styled.details<{ mode: Mode }>`
  display: inline-block;
  margin: 0 0 12px;

  summary:first-of-type {
    font-size: 12px;
    cursor: pointer;
  }

  p {
    line-height: 1.25;
    margin: 12px 0;
    padding: 12px;
    font-size: 14px;
    background: ${({ mode }) => (mode === 'light' ? 'white' : PB50T)};
    border-radius: 4px;
    border: 1px solid ${PB80T};
  }
`
const Messages = styled.details<{ mode: Mode }>`
  display: inline-block;
  margin: 12px 0 0;

  summary:first-of-type {
    font-size: 12px;
    color: ${({ mode }) => (mode === 'light' ? 'blue' : 'orange')};
    cursor: pointer;
  }

  ul {
    padding: 0;
    margin: 12px 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    background: ${({ mode }) => (mode === 'light' ? 'white' : PB50T)};
    border-radius: 4px;
    border: 1px solid ${PB80T};

    li {
      font-size: 14px;
      line-height: 1.25;
      padding: 8px;
      border-bottom: 1px dotted ${PB80T};
    }

    li:last-child {
      border-bottom: none;
    }
  }
`
const Time: FC<FormatProps> = ({ epochTime, affectedByLayover }) => {
  const date = new Date(epochTime)
  const dateTime = date.toISOString()
  const time = date.toLocaleTimeString([], { timeStyle: 'short' })

  return (
    <time dateTime={dateTime}>
      {time}
      {affectedByLayover && <sup>*</sup>}
    </time>
  )
}
const Minutes: FC<FormatProps> = ({ minutes, affectedByLayover }) => {
  return (
    <time dateTime={`PT${minutes}M`}>
      {minutes} min{affectedByLayover && <sup>*</sup>}
    </time>
  )
}
const Predictions: FC<PredictionsProps> = ({
  route,
  preds,
  stop,
  messages,
  timestamp,
  locateActive
}) => {
  const { mode } = useTheme()
  const { format } = usePredictionsSettings()
  const { markPredictedVehicles } = useVehicleSettings()
  const Format = format === 'minutes' ? Minutes : Time

  if (Array.isArray(preds) && stop && route) {
    if (preds.length) {
      const values = preds[0].values.slice(0, 3)
      const title = values[0].isDeparture ? 'Departures' : 'Arrivals'
      const event = values[0].isDeparture ? 'Departing' : 'Arriving'
      const affectedByLayover = values.find(value => value.affectedByLayover)
      const freshness = new Date(timestamp)

      return (
        <Section>
          <header>
            <h2>Next {title}</h2>
            <h3>{stop.title}</h3>
          </header>
          {locateActive && <UserLocator withDistance />}
          {messages.length > 0 && (
            <Messages mode={mode}>
              <summary>Messages 💬</summary>
              <ul>
                {messages.map((message, idx) => (
                  <li key={idx}>{message.text}</li>
                ))}
              </ul>
            </Messages>
          )}
          <List markPredictedVehicles={markPredictedVehicles} mode={mode}>
            {values.map(
              ({ minutes, epochTime, direction, affectedByLayover, vehicle }) => (
                <li key={`${epochTime}-${vehicle.id}`}>
                  {minutes === 0 ? (
                    <em>{event}</em>
                  ) : markPredictedVehicles ? (
                    <VehicleLocator vehicleId={vehicle.id}>
                      <Format
                        minutes={minutes}
                        epochTime={epochTime}
                        affectedByLayover={affectedByLayover}
                      />
                    </VehicleLocator>
                  ) : (
                    <Format
                      minutes={minutes}
                      epochTime={epochTime}
                      affectedByLayover={affectedByLayover}
                    />
                  )}
                  <span>
                    {route.title} &bull; {direction.title}
                  </span>
                </li>
              )
            )}
          </List>
          {affectedByLayover && (
            <AffectedByLayover mode={mode}>
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
