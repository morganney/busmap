import { createContext, useContext, useReducer, useMemo } from 'react'

import type { FC, ReactNode, Dispatch } from 'react'

interface VehicleSettingsState {
  markPredictedVehicles: boolean
  dispatch: Dispatch<VehicleSettingsAction>
}
interface MarkPredictedVehicles {
  type: 'markPredictedVehicles'
  value: boolean
}
type VehicleSettingsAction = MarkPredictedVehicles
const defaultState: VehicleSettingsState = {
  dispatch: () => {},
  markPredictedVehicles: true
}
const VehicleSettings = createContext<VehicleSettingsState>(defaultState)
const reducer = (state: VehicleSettingsState, action: VehicleSettingsAction) => {
  switch (action.type) {
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
