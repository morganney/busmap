import { memo, useEffect } from 'react'
import { latLng, latLngBounds } from 'leaflet'
import { useQuery } from '@tanstack/react-query'

import { Loading } from '@core/components/loading.js'
import { useMap } from '@core/contexts/map.js'
import { useHomeStop } from '@core/hooks/useHomeStop.js'

import { get } from '../api/predictions.js'
import { useLocation } from '../contexts/location.js'
import { useLocateUser } from '../hooks/useLocateUser.js'

interface LocationProps {
  active: boolean
}

const Location = memo(function Location({ active = false }: LocationProps) {
  const map = useMap()
  const homeStop = useHomeStop()
  const { permission, position } = useLocation()
  const { data: predictions } = useQuery({
    queryKey: ['location', [position?.lat, position?.lon]],
    queryFn: () => get(position),
    enabled: permission === 'granted'
  })

  useLocateUser(active && permission !== 'denied')

  useEffect(() => {
    if (active && permission === 'denied' && !homeStop && map) {
      // Roughly North America (USA, Cananda, Mexico)
      map.fitBounds(
        latLngBounds(latLng(6.089467, -128.009169), latLng(73.28682, -78.506175))
      )
    }
  }, [active, homeStop, permission, map])

  if (!position && permission !== 'denied') {
    return <Loading text="Attempting to locate your position..." />
  }

  if (permission === 'denied') {
    return <p>Permission denied.</p>
  }

  if (Array.isArray(predictions)) {
    return predictions.map(prediction => {
      return (
        <article key={prediction.stop.id}>
          <h5>{prediction.agency.title}</h5>
          <h6>{prediction.route.title}</h6>
          <ul>
            {prediction.values.map((pred, idx) => (
              <li key={idx}>{pred.minutes}</li>
            ))}
          </ul>
        </article>
      )
    })
  }

  return null
})

export { Location }
