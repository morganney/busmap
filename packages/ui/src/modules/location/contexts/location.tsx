import { createContext, useContext, useReducer, useMemo, useEffect } from 'react'

import type { FC, ReactNode, Dispatch } from 'react'
import type { Point } from '@core/types'

interface Position {
  point: Point
  accuracy: number
}
interface LocationState {
  permission: PermissionState
  locationSettled: boolean
  position?: Position
}
interface LocationContext extends LocationState {
  dispatch: Dispatch<LocationAction>
}
interface LocationSettled {
  type: 'locationSettled'
  value: boolean
}
interface LocationChanged {
  type: 'locationChanged'
  value: Position
}
interface PermissionChanged {
  type: 'permission'
  value: PermissionState
}
type LocationAction = LocationSettled | LocationChanged | PermissionChanged

const status = await navigator.permissions.query({ name: 'geolocation' })
const defaultState: LocationState = {
  permission: status.state,
  locationSettled: false,
  position: undefined
}
const defaultContext = {
  ...defaultState,
  dispatch: () => {}
}
const Location = createContext<LocationContext>(defaultContext)
const reducer = (state: LocationState, action: LocationAction) => {
  switch (action.type) {
    case 'permission':
      return { ...state, permission: action.value }
    case 'locationSettled':
      return { ...state, locationSettled: action.value }
    case 'locationChanged':
      return {
        ...state,
        position: /*action.value*/ {
          point: { lat: 37.784825, lon: -122.395592 },
          accuracy: 100
        }
      }
    default:
      return state
  }
}
const LocationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState)
  const context = useMemo(() => ({ ...state, dispatch }), [state, dispatch])

  useEffect(() => {
    const onPermissionChanged = () => {
      dispatch({ type: 'permission', value: status.state })
    }

    status.addEventListener('change', onPermissionChanged)

    return () => {
      status.removeEventListener('change', onPermissionChanged)
    }
  }, [])

  return <Location.Provider value={context}>{children}</Location.Provider>
}
const useLocation = () => {
  return useContext(Location)
}

export { LocationProvider, useLocation }
