import { useEffect } from 'react'
import { latLng as lLatLng } from 'leaflet'

import { useGlobals } from '../globals.js'

import type { Map } from 'leaflet'

interface UseZoomPredForVehicle {
  map: Map | null
}

const useZoomPredForVehicle = ({ map }: UseZoomPredForVehicle) => {
  const { predForVeh } = useGlobals()

  useEffect(() => {
    if (predForVeh && map) {
      const { lat, lon } = predForVeh
      const latLng = lLatLng(lat, lon)

      map.setView(latLng, Math.max(map.getZoom(), 16))
    }
  }, [predForVeh, map])
}

export { useZoomPredForVehicle }
