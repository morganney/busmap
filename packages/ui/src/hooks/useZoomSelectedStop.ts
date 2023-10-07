import { useEffect, useContext } from 'react'
import L from 'leaflet'

import { Globals } from '../globals.js'

import type { Map } from 'leaflet'

interface UseZoomSelectedStop {
  map: Map | null
}

const useZoomSelectedStop = ({ map }: UseZoomSelectedStop) => {
  const { stop } = useContext(Globals)

  useEffect(() => {
    if (stop && map) {
      const { lat, lon } = stop

      map.setView(L.latLng(lat, lon), Math.max(map.getZoom(), 15))
    }
  }, [stop, map])
}

export { useZoomSelectedStop }
