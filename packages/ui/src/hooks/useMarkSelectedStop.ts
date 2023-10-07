import { useEffect, useRef, useContext } from 'react'
import L from 'leaflet'

import { Globals } from '../globals.js'

import type { Map } from 'leaflet'

interface UseMarkSelectedStop {
  map: Map | null
}

const useMarkSelectedStop = ({ map }: UseMarkSelectedStop) => {
  const { stop } = useContext(Globals)
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
