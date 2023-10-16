import { createContext, useContext, useReducer, useMemo } from 'react'

import type { FC, ReactNode, Dispatch } from 'react'

type SpeedUnit = 'kph' | 'mph'
interface VehicleSettingsState {
  markPredictedVehicles: boolean
  speedUnit: SpeedUnit
  dispatch: Dispatch<VehicleSettingsAction>
}
interface MarkPredictedVehicles {
  type: 'markPredictedVehicles'
  value: boolean
}
interface SpeedUnitChanged {
  type: 'speedUnit'
  value: SpeedUnit
}
type VehicleSettingsAction = MarkPredictedVehicles | SpeedUnitChanged
const defaultState: VehicleSettingsState = {
  dispatch: () => {},
  speedUnit: 'kph',
  markPredictedVehicles: true
}
const VehicleSettings = createContext<VehicleSettingsState>(defaultState)
const reducer = (state: VehicleSettingsState, action: VehicleSettingsAction) => {
  switch (action.type) {
    case 'speedUnit':
      return { ...state, speedUnit: action.value }
    case 'markPredictedVehicles':
      return { ...state, markPredictedVehicles: action.value }
    default:
      return { ...defaultState, ...state }
  }
}
const VehicleSettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicleSettings, dispatch] = useReducer(reducer, defaultState)
  const context = useMemo(
    () => ({ ...vehicleSettings, dispatch }),
    [vehicleSettings, dispatch]
  )

  return <VehicleSettings.Provider value={context}>{children}</VehicleSettings.Provider>
}
const useVehicleSettings = () => {
  return useContext(VehicleSettings)
}

export { VehicleSettingsProvider, useVehicleSettings }
export type { SpeedUnit }
