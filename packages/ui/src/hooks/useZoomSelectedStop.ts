import { useEffect, useRef, useContext } from 'react'
import L from 'leaflet'

import { Globals } from '../globals.js'

import type { Map } from 'leaflet'

interface UseZoomSelectedStop {
  map: Map | null
}

const useZoomSelectedStop = ({ map }: UseZoomSelectedStop) => {
  const { stop } = useContext(Globals)
  const marker = useRef(L.marker([0, 0]))

  useEffect(() => {
    if (stop && map) {
      const { lat, lon } = stop
      const latLng = L.latLng(lat, lon)

      map.setView(latLng, Math.max(map.getZoom(), 16))
      marker.current.bindPopup(stop.title ?? 'Your selected stop.')
      marker.current.setLatLng(latLng).addTo(map)
    }

    if (!stop) {
      marker.current.remove()
    }
  }, [stop, map])
}

export { useZoomSelectedStop }
