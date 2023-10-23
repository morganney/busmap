import { useEffect } from 'react'
import { marker, latLng, latLngBounds } from 'leaflet'

import { useBusSelectorBookmark } from './useBusSelectorBookmarks.js'

import { useGlobals } from '../globals.js'

import type { Map } from 'leaflet'

interface UseLocateUser {
  map: Map | null
}
const useLocateUser = ({ map }: UseLocateUser) => {
  const { locationSettled, dispatch } = useGlobals()
  const bookmark = useBusSelectorBookmark()

  useEffect(() => {
    if (map && !locationSettled) {
      if (!Object.keys(bookmark).length) {
        map.on('locationfound', evt => {
          marker(evt.latlng)
            .addTo(map)
            .bindPopup(
              `Your location within ${Intl.NumberFormat().format(evt.accuracy)} meters.`
            )
          dispatch({ type: 'locationSettled', value: true })
        })
        map.on('locationerror', () => {
          // Roughly North America (USA, Cananda, Mexico)
          map.fitBounds(
            latLngBounds(latLng(6.089467, -128.009169), latLng(73.28682, -78.506175))
          )
          dispatch({ type: 'locationSettled', value: true })
        })
        map.locate({ setView: true, enableHighAccuracy: true })
      } else {
        dispatch({ type: 'locationSettled', value: true })
      }
    }
  }, [map, locationSettled, bookmark, dispatch])
}

export { useLocateUser }
