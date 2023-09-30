import { useEffect } from 'react'
import L from 'leaflet'

import type { Map } from 'leaflet'
import type { BusmapAction } from '../types.js'

interface UseLocateUser {
  map: Map | null
  locationSettled: boolean
  dispatch: (value: BusmapAction) => void
}
const useLocateUser = ({ map, locationSettled, dispatch }: UseLocateUser) => {
  useEffect(() => {
    if (map && !locationSettled) {
      map.on('locationfound', evt => {
        L.marker(evt.latlng)
          .addTo(map)
          .bindPopup(
            `Your location within ${Intl.NumberFormat().format(evt.accuracy)} meters.`
          )
        dispatch({ type: 'locationSettled', value: true })
      })
      map.on('locationerror', () => {
        // Roughly North America (USA, Cananda, Mexico)
        map.fitBounds(
          L.latLngBounds(L.latLng(6.089467, -128.009169), L.latLng(73.28682, -78.506175))
        )
        dispatch({ type: 'locationSettled', value: true })
      })
      map.locate({ setView: true, enableHighAccuracy: true })
    }
  }, [map, locationSettled, dispatch])
}

export { useLocateUser }
