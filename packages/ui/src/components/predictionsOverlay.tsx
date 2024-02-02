import styled from 'styled-components'
import { useCallback } from 'react'
import { latLng } from 'leaflet'
import { MapMarked } from '@busmap/components/icons/mapMarked'
import { PB20T } from '@busmap/components/colors'

import { Time } from './predictionFormats/time.js'
import { Minutes } from './predictionFormats/minutes.js'

import { useGlobals } from '../globals.js'
import { useMap } from '../contexts/map.js'
import { useVehicles } from '../contexts/vehicles.js'
import { useTheme } from '../modules/settings/contexts/theme.js'
import { usePredictionsSettings } from '../modules/settings/contexts/predictions.js'
import { useVehicleSettings } from '../modules/settings/contexts/vehicle.js'
import { PredictedVehiclesColors, blinkStyles } from '../common.js'

import type { FC } from 'react'
import type { Prediction, Stop } from '@core/types'
import type { Mode } from '@busmap/common/types/settings'

interface PredictionsOverlayProps {
  preds?: Prediction[]
  stop?: Stop
}

const Section = styled.section<{ $mode: Mode }>`
  position: fixed;
  right: 8px;
  top: 8px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 100px;
  max-width: 132px;

  h3 {
    margin: 0;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: ${({ $mode }) => ($mode === 'light' ? 'black' : 'white')};
  }

  @media (width > 431px) {
    right: 24px;
    top: 24px;
    max-width: 175px;
  }
`
const Preds = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`
const Pred = styled.li<{ markPredictedVehicles: boolean; $mode: Mode }>`
  button {
    color: ${({ markPredictedVehicles }) => (markPredictedVehicles ? 'white' : PB20T)};
    text-shadow: ${({ markPredictedVehicles }) =>
      markPredictedVehicles ? `0 0 2px ${PB20T}` : 'none'};
  }

  &:last-child button {
    background-color: ${({ markPredictedVehicles }) =>
      markPredictedVehicles ? PredictedVehiclesColors.red : '#ffffffcc'};
  }

  &:first-child button {
    background-color: ${({ markPredictedVehicles }) =>
      markPredictedVehicles ? PredictedVehiclesColors.green : '#ffffffcc'};
  }

  &:nth-child(2) button {
    background-color: ${({ markPredictedVehicles }) =>
      markPredictedVehicles ? PredictedVehiclesColors.yellow : '#ffffffcc'};
  }
`
const Button = styled.button`
  padding: 4px 8px;
  margin: 0;
  cursor: pointer;
  border: none;
  font-size: 1.6rem;
  font-weight: bold;
  min-height: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;

  em {
    ${blinkStyles};
  }
`
const PredictionsOverlay: FC<PredictionsOverlayProps> = ({ preds, stop }) => {
  const map = useMap()
  const { collapsed, dispatch } = useGlobals()
  const { mode } = useTheme()
  const vehicles = useVehicles()
  const { format, persistentOverlay } = usePredictionsSettings()
  const { markPredictedVehicles } = useVehicleSettings()
  const onClickPred = useCallback(
    (vid: string) => {
      if (Array.isArray(vehicles)) {
        const vehicle = vehicles.find(({ id }) => id === vid)

        if (vehicle) {
          dispatch({ type: 'predForVeh', value: vehicle })
        }
      }
    },
    [dispatch, vehicles]
  )
  const onClickTitle = useCallback(() => {
    if (map && stop) {
      const { lat, lon } = stop
      const latLon = latLng(lat, lon)

      map.setView(latLon, Math.max(map.getZoom(), 16))
    }
  }, [stop, map])

  if ((!collapsed && !persistentOverlay) || !preds?.length || !stop) {
    return null
  }

  const values = preds[0].values.slice(0, 3)
  const title = values[0].isDeparture ? 'Departures' : 'Arrivals'
  const event = values[0].isDeparture ? 'Departing' : 'Arriving'
  const Format = format === 'minutes' ? Minutes : Time

  return (
    <Section $mode={mode}>
      <h3>
        <span>{title}</span>
        <MapMarked onClick={onClickTitle} color={mode === 'light' ? 'black' : 'white'} />
      </h3>
      <Preds>
        {values.map(({ minutes, epochTime, affectedByLayover, vehicle }) => (
          <Pred
            key={`${epochTime}-${vehicle.id}`}
            $mode={mode}
            markPredictedVehicles={markPredictedVehicles}>
            <Button onClick={() => onClickPred(vehicle.id)}>
              {minutes === 0 ? (
                <em>{event}</em>
              ) : (
                <Format
                  minutes={minutes}
                  epochTime={epochTime}
                  affectedByLayover={affectedByLayover}
                />
              )}
            </Button>
          </Pred>
        ))}
      </Preds>
    </Section>
  )
}

export { PredictionsOverlay }
