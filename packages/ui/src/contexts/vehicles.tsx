import { createContext, useContext, useReducer, useMemo } from 'react'

import type { FC, ReactNode, Dispatch } from 'react'
import type { Vehicle } from '../types.js'

interface SetVehicles {
  type: 'set'
  value?: Vehicle[]
}
interface ResetVehicles {
  type: 'reset'
}
type VehiclesAction = SetVehicles | ResetVehicles

const Vehicles = createContext<Vehicle[] | undefined>(undefined)
const VehiclesDispatch = createContext<Dispatch<VehiclesAction>>(() => {})
const reducer = (state: Vehicle[] | undefined, action: VehiclesAction) => {
  switch (action.type) {
    case 'set':
      return action.value
    case 'reset': {
      return state ? [...state] : undefined
    }
    default:
      return state
  }
}
const VehiclesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, dispatch] = useReducer(reducer, undefined)
  const context = useMemo(() => vehicles, [vehicles])

  return (
    <Vehicles.Provider value={context}>
      <VehiclesDispatch.Provider value={dispatch}>{children}</VehiclesDispatch.Provider>
    </Vehicles.Provider>
  )
}
const useVehicles = () => {
  return useContext(Vehicles)
}
const useVehiclesDispatch = () => {
  return useContext(VehiclesDispatch)
}

export { VehiclesProvider, useVehicles, useVehiclesDispatch }
