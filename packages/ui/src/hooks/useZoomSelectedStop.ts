import { useEffect } from 'react'
import L from 'leaflet'

import type { Map } from 'leaflet'
import type { Stop } from '../types.js'

interface UseZoomSelectedStop {
  stop?: Stop
  map: Map | null
}

const useZoomSelectedStop = ({ stop, map }: UseZoomSelectedStop) => {
  useEffect(() => {
    if (stop && map) {
      const { lat, lon } = stop

      map.setView(L.latLng(lat, lon), Math.max(map.getZoom(), 15))
    }
  }, [stop, map])
}

export { useZoomSelectedStop }
