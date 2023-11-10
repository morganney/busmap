import { useEffect } from 'react'
import { marker } from 'leaflet'

import { useMap } from '@core/contexts/map.js'
import { useHomeStop } from '@core/hooks/useHomeStop.js'

import { useLocation } from '../contexts/location'

const useLocateUser = (active: boolean) => {
  const map = useMap()
  const homeStop = useHomeStop()
  const { dispatch } = useLocation()

  useEffect(() => {
    map?.on('locationfound', evt => {
      marker(evt.latlng)
        .addTo(map)
        .bindPopup(
          `Your location within ${Intl.NumberFormat().format(evt.accuracy)} meters.`
        )
      dispatch({
        type: 'locationChanged',
        value: { lat: evt.latlng.lat, lon: evt.latlng.lng }
      })
    })
    map?.on('locationerror', err => {
      if (err.code === 1 || /denied/i.test(err.message)) {
        dispatch({ type: 'permission', value: 'denied' })
      }
    })
  }, [map, dispatch])

  useEffect(() => {
    if (active && map) {
      map.locate({ setView: !homeStop, watch: true })
    }

    if (!active && map) {
      map.stopLocate()
    }
  }, [active, map, homeStop, dispatch])
}

export { useLocateUser }
