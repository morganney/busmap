import { createContext } from 'react'

import type { BusmapGlobals } from './types'

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

export default defaultGlobals
export { Globals }
