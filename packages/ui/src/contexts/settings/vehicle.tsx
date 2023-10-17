import { createContext, useContext, useReducer, useMemo } from 'react'

import type { FC, ReactNode, Dispatch } from 'react'

type SpeedUnit = 'kph' | 'mph'
interface VehicleSettingsState {
  visible: boolean
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
interface VisibileChanged {
  type: 'visibile'
  value: boolean
}
type VehicleSettingsAction = VisibileChanged | SpeedUnitChanged | MarkPredictedVehicles

const defaultState: VehicleSettingsState = {
  dispatch: () => {},
  speedUnit: 'kph',
  visible: true,
  markPredictedVehicles: true
}
const VehicleSettings = createContext<VehicleSettingsState>(defaultState)
const reducer = (state: VehicleSettingsState, action: VehicleSettingsAction) => {
  switch (action.type) {
    case 'visibile':
      return { ...state, visible: action.value }
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
