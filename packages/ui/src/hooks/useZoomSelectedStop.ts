import { useEffect, useRef } from 'react'
import { marker as lMarker, latLng as lLatLng } from 'leaflet'

import { useGlobals } from '../globals.js'

import type { Map } from 'leaflet'

interface UseZoomSelectedStop {
  map: Map | null
}

const useZoomSelectedStop = ({ map }: UseZoomSelectedStop) => {
  const { stop } = useGlobals()
  const marker = useRef(lMarker([0, 0]))

  useEffect(() => {
    if (stop && map) {
      const { lat, lon } = stop
      const latLng = lLatLng(lat, lon)

      map.setView(latLng, Math.max(map.getZoom() ?? 1, 16))
      marker.current.bindPopup(stop.title ?? 'Your selected stop.')
      marker.current.setLatLng(latLng).addTo(map)
    }

    if (!stop) {
      marker.current.remove()
    }
  }, [stop, map])
}

export { useZoomSelectedStop }
