import { useEffect, useContext } from 'react'
import L from 'leaflet'

import { Globals } from '../globals.js'

import type { Map } from 'leaflet'

interface UseLocateUser {
  map: Map | null
}
const useLocateUser = ({ map }: UseLocateUser) => {
  const { locationSettled, dispatch } = useContext(Globals)

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
