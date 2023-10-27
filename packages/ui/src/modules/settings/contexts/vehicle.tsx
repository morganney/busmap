import { createContext, useContext, useReducer, useMemo } from 'react'

import { useStorage } from '../../../contexts/storage.js'
import { isASpeedUnit } from '../util.js'

import type { FC, ReactNode, Dispatch } from 'react'
import type { SpeedUnit } from '../types.js'

interface VehicleSettingsState {
  visible: boolean
  hideOtherDirections: boolean
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
interface HideOtherDirectionsChanged {
  type: 'hideOtherDirections'
  value: boolean
}
type VehicleSettingsAction =
  | VisibileChanged
  | SpeedUnitChanged
  | MarkPredictedVehicles
  | HideOtherDirectionsChanged

const defaultState: VehicleSettingsState = {
  dispatch: () => {},
  speedUnit: 'kph',
  visible: true,
  hideOtherDirections: false,
  markPredictedVehicles: true
}
const VehicleSettings = createContext<VehicleSettingsState>(defaultState)
const reducer = (state: VehicleSettingsState, action: VehicleSettingsAction) => {
  switch (action.type) {
    case 'visibile':
      return { ...state, visible: action.value }
    case 'hideOtherDirections':
      return { ...state, hideOtherDirections: action.value }
    case 'speedUnit':
      return { ...state, speedUnit: action.value }
    case 'markPredictedVehicles':
      return { ...state, markPredictedVehicles: action.value }
    default:
      return { ...defaultState, ...state }
  }
}
const VehicleSettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { vehicleSpeedUnit, vehicleColorPredicted } = useStorage()
  const [vehicleSettings, dispatch] = useReducer(reducer, {
    ...defaultState,
    speedUnit: vehicleSpeedUnit ?? 'kph',
    markPredictedVehicles: vehicleColorPredicted ?? true
  })
  const context = useMemo(
    () => ({ ...vehicleSettings, dispatch }),
    [vehicleSettings, dispatch]
  )

  return <VehicleSettings.Provider value={context}>{children}</VehicleSettings.Provider>
}
const useVehicleSettings = () => {
  return useContext(VehicleSettings)
}

export { VehicleSettingsProvider, useVehicleSettings, isASpeedUnit }
