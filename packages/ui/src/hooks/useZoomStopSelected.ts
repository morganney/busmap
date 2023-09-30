import { useEffect } from 'react'
import L from 'leaflet'

import type { Map } from 'leaflet'
import type { Stop } from '../types.js'

interface UseZoomStopSelected {
  stop?: Stop
  map: Map | null
}

const useZoomStopSelected = ({ stop, map }: UseZoomStopSelected) => {
  useEffect(() => {
    if (stop) {
      const { lat, lon } = stop

      map?.setView(L.latLng(lat, lon), 16)
    }
  }, [stop, map])
}

export { useZoomStopSelected }
