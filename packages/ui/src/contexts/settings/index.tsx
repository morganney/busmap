import { VehicleSettingsProvider, useVehicleSettings } from './vehicle.js'

import type { FC, ReactNode } from 'react'

const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <VehicleSettingsProvider>{children}</VehicleSettingsProvider>
}
const useSettings = () => {
  return {
    vehicle: useVehicleSettings()
  }
}
export { SettingsProvider, useSettings }
export type { SpeedUnit } from './vehicle.js'
