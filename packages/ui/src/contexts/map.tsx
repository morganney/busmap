import { createContext, useContext, useReducer, useMemo } from 'react'

import type { FC, ReactNode, Dispatch } from 'react'
import type { Map } from 'leaflet'

interface SetMap {
  type: 'set'
  value: Map
}
type MapAction = SetMap

const MapContext = createContext<Map | null>(null)
const MapDispatch = createContext<Dispatch<MapAction>>(() => {})
const reducer = (state: Map | null, action: MapAction) => {
  switch (action.type) {
    case 'set':
      return action.value
    default:
      return state
  }
}
const MapProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [map, dispatch] = useReducer(reducer, null)
  const context = useMemo(() => map, [map])

  return (
    <MapContext.Provider value={context}>
      <MapDispatch.Provider value={dispatch}>{children}</MapDispatch.Provider>
    </MapContext.Provider>
  )
}
const useMap = () => {
  return useContext(MapContext)
}
const useMapDispatch = () => {
  return useContext(MapDispatch)
}

export { MapProvider, useMap, useMapDispatch }
