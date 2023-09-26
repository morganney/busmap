import { createContext } from 'react'

import type { BusmapGlobals, BusmapAction } from './types.js'

type BusmapState = Omit<BusmapGlobals, 'dispatch'>

const defaultGlobals = {
  dispatch: () => {},
  locationSettled: false,
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
    case 'bounds':
      return { ...state, bounds: action.value }
    case 'agency':
      return {
        ...state,
        agency: action.value,
        selected: undefined
      }
    case 'route':
      return { ...state, route: action.value, direction: undefined, selected: undefined }
    case 'direction':
      return { ...state, direction: action.value, stop: undefined, selected: undefined }
    case 'stop':
      return { ...state, stop: action.value }
    case 'locationSettled': {
      return { ...state, locationSettled: action.value }
    }
    case 'selected': {
      return { ...state, selected: action.value }
    }
    default:
      return { ...defaultGlobals, ...state }
  }
}

export default defaultGlobals
export { Globals, reducer }
