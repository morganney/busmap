import { createContext, useContext, useReducer, useMemo } from 'react'

import type { FC, ReactNode } from 'react'
import type { BusmapGlobals, BusmapAction } from './types.js'

type BusmapState = Omit<BusmapGlobals, 'dispatch'>

const defaultGlobals: BusmapGlobals = {
  dispatch: () => {},
  page: 'select',
  collapsed: true,
  center: { lat: 37.7775, lon: -122.416389 },
  bounds: {
    sw: {
      lat: 37.7625799,
      lon: -122.43498
    },
    ne: {
      lat: 37.8085899,
      lon: -122.39344
    }
  }
}
const Globals = createContext<BusmapGlobals>(defaultGlobals)
const reducer = (state: BusmapState, action: BusmapAction): BusmapState => {
  switch (action.type) {
    case 'user':
      return { ...state, user: action.value }
    case 'page':
      return { ...state, page: action.value }
    case 'collapsed':
      return { ...state, collapsed: action.value }
    case 'bounds':
      return { ...state, bounds: action.value }
    case 'agency':
      return {
        ...state,
        agency: action.value,
        route: undefined,
        direction: undefined,
        stop: undefined
      }
    case 'route':
      return {
        ...state,
        route: action.value,
        direction: undefined,
        stop: undefined
      }
    case 'direction':
      return {
        ...state,
        direction: action.value,
        stop: undefined
      }
    case 'stop':
      return { ...state, stop: action.value }
    case 'predForVeh':
      return { ...state, predForVeh: action.value }
    case 'selected':
      return { ...state, selected: action.value }
    default:
      return { ...defaultGlobals, ...state }
  }
}
const GlobalsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [globals, dispatch] = useReducer(reducer, defaultGlobals)
  const context = useMemo(() => ({ ...globals, dispatch }), [globals, dispatch])

  return <Globals.Provider value={context}>{children}</Globals.Provider>
}
const useGlobals = () => {
  return useContext(Globals)
}

export { GlobalsProvider, useGlobals }
