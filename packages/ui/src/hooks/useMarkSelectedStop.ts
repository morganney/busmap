import { useEffect, useRef } from 'react'
import L from 'leaflet'

import type { Map } from 'leaflet'
import type { Stop } from '../types.js'

interface UseMarkSelectedStop {
  stop?: Stop
  map: Map | null
}

const useMarkSelectedStop = ({ stop, map }: UseMarkSelectedStop) => {
  const marker = useRef(L.marker([0, 0]))

  useEffect(() => {
    if (stop && map) {
      const { lat, lon } = stop

      marker.current.setLatLng(L.latLng(lat, lon)).addTo(map)
    }

    if (!stop) {
      marker.current.remove()
    }
  }, [stop, map])
}

export { useMarkSelectedStop }
