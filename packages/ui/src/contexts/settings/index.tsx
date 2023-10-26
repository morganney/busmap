import { ThemeProvider, useTheme } from './theme.js'
import { VehicleSettingsProvider, useVehicleSettings } from './vehicle.js'
import { PredictionsSettingsProvider, usePredictionsSettings } from './predictions.js'

import type { FC, ReactNode } from 'react'

const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <VehicleSettingsProvider>
        <PredictionsSettingsProvider>{children}</PredictionsSettingsProvider>
      </VehicleSettingsProvider>
    </ThemeProvider>
  )
}
const useSettings = () => {
  return {
    theme: useTheme(),
    vehicle: useVehicleSettings(),
    predictions: usePredictionsSettings()
  }
}

export { SettingsProvider, useSettings }
