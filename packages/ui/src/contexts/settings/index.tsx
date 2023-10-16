import { VehicleSettingsProvider, useVehicleSettings } from './vehicle.js'
import { PredictionsSettingsProvider, usePredictionsSettings } from './predictions.js'

import type { FC, ReactNode } from 'react'

const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <VehicleSettingsProvider>
      <PredictionsSettingsProvider>{children}</PredictionsSettingsProvider>
    </VehicleSettingsProvider>
  )
}
const useSettings = () => {
  return {
    vehicle: useVehicleSettings(),
    predictions: usePredictionsSettings()
  }
}
export { SettingsProvider, useSettings }
export type { SpeedUnit } from './vehicle.js'
export type { PredictionFormat } from './predictions.js'
