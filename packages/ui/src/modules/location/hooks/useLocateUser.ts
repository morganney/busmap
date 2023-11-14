import { useEffect, useMemo, useRef } from 'react'
import debounce from 'lodash.debounce'

import { useMap } from '@core/contexts/map.js'
import { useHomeStop } from '@core/hooks/useHomeStop.js'

import { useLocation } from '../contexts/location'

import type { LocationEvent } from 'leaflet'

const useLocateUser = (active: boolean) => {
  const map = useMap()
  const homeStop = useHomeStop()
  const viewSet = useRef(Boolean(homeStop))
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
      },
      10_000,
      { leading: true, trailing: false }
    )
  }, [dispatch])

  useEffect(() => {
    if (map) {
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
        setView: !viewSet.current,
        watch: true,
        maximumAge: 5_000
      })

      if (!viewSet.current) {
        viewSet.current = true
      }
    }

    if (!active && map) {
      map.stopLocate()
    }
  }, [active, map, homeStop, dispatch])
}

export { useLocateUser }
