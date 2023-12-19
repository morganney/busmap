import { useMemo } from 'react'

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
  const theme = useTheme()
  const vehicle = useVehicleSettings()
  const predictions = usePredictionsSettings()

  const settings = useMemo(
    () => ({
      theme,
      vehicle,
      predictions
    }),
    [theme, vehicle, predictions]
  )

  return settings
}

export { SettingsProvider, useSettings }
