import { createContext } from 'react'

import type { BusmapGlobals } from './types'

const defaultGlobals = {
  dispatch: () => {},
  agency: undefined,
  route: null,
  center: { lat: 32.79578, lon: -95.45166 },
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

export default defaultGlobals
export { Globals }
