import { useEffect, useMemo, useRef } from 'react'
import debounce from 'lodash.debounce'

import { useMap } from '@core/contexts/map.js'

import { useLocation } from '../contexts/location'

import type { LocationEvent } from 'leaflet'

const useLocateUser = (active: boolean) => {
  const map = useMap()
  const viewSet = useRef(false)
  const { dispatch } = useLocation()
  const onLocationChanged = useMemo(() => {
    return debounce(
      (evt: LocationEvent) => {
        const { latlng, accuracy } = evt
        /**
         * Five decimal places is enough accuracy as it
         * can distinguish trees from each other.
         *
         * @see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
         */
        const lat = parseFloat(latlng.lat.toFixed(5))
        const lon = parseFloat(latlng.lng.toFixed(5))

        dispatch({
          type: 'locationChanged',
          value: { accuracy, point: { lat, lon } }
        })

        if (!viewSet.current && map) {
          map.setView(latlng, Math.max(map.getZoom() ?? 1, 15))
          viewSet.current = true
        }
      },
      10_000,
      { leading: true, trailing: false }
    )
  }, [dispatch, map])

  useEffect(() => {
    if (map) {
      map.on('load', () => {
        viewSet.current = true
      })
      map.on('locationfound', onLocationChanged)
      map.on('locationerror', err => {
        if (err.code === 1 || /denied/i.test(err.message)) {
          dispatch({ type: 'permission', value: 'denied' })
        }
      })
    }
  }, [map, onLocationChanged, dispatch])

  useEffect(() => {
    if (active && map) {
      map.locate({
        setView: false,
        watch: true,
        maximumAge: 5_000
      })
    }

    if (!active && map) {
      map.stopLocate()
    }
  }, [active, map, dispatch])
}

export { useLocateUser }
