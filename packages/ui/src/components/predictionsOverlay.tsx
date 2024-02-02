import styled from 'styled-components'
import { useCallback } from 'react'

import { Time } from './predictionFormats/time.js'
import { Minutes } from './predictionFormats/minutes.js'

import { useGlobals } from '../globals.js'
import { useVehicles } from '../contexts/vehicles.js'
import { useTheme } from '../modules/settings/contexts/theme.js'
import { usePredictionsSettings } from '../modules/settings/contexts/predictions.js'
import { useVehicleSettings } from '../modules/settings/contexts/vehicle.js'
import { PredictedVehiclesColors, blinkStyles } from '../common.js'

import type { FC } from 'react'
import type { Prediction } from '@core/types'
import type { Mode } from '@busmap/common/types/settings'

interface PredictionsOverlayProps {
  preds?: Prediction[]
}

const Section = styled.section`
  position: fixed;
  right: 24px;
  top: 24px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 100px;

  h3 {
    margin: 0;
    font-size: 2rem;
    text-align: center;
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
  font-size: 1.4rem;
  font-weight: bold;
  min-height: 28px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  em {
    ${blinkStyles};
  }
`
const PredictionsOverlay: FC<PredictionsOverlayProps> = ({ preds }) => {
  const { collapsed, dispatch } = useGlobals()
  const { mode } = useTheme()
  const vehicles = useVehicles()
  const { format } = usePredictionsSettings()
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

  if (!collapsed || !preds?.length) {
    return null
  }

  const values = preds[0].values.slice(0, 3)
  const title = values[0].isDeparture ? 'Departures' : 'Arrivals'
  const event = values[0].isDeparture ? 'Departing' : 'Arriving'
  const Format = format === 'minutes' ? Minutes : Time

  return (
    <Section>
      <h3>{title}</h3>
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
