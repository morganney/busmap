import { useEffect } from 'react'
import { marker, divIcon, latLng } from 'leaflet'
import { SLB20T } from '@busmap/components/colors'

import { useMap } from '@core/contexts/map.js'

import { useLocation } from '../contexts/location.js'

const icon = divIcon({
  html: `
    <svg viewBox="0 0 192 512" width="28" height="28">
      <path d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z" />
    </svg>
  `,
  className: 'busmap-user',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
})
const circle = divIcon({
  html: `
    <svg viewBox="0 0 100 100" width="16" height="16">
      <circle cx="50" cy="50" r="48" stroke-width="2" stroke="${SLB20T}" fill="${SLB20T}" fill-opacity="0.4" />
    </svg>
  `,
  className: 'busmap-user-circle',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
})
const user = marker([0, 0], { icon })
const userCircle = marker([0, 0], { icon: circle })
const useTrackUser = () => {
  const map = useMap()
  const { position, permission } = useLocation()

  useEffect(() => {
    if (map && permission === 'granted') {
      userCircle.addTo(map)
      user
        .addTo(map)
        .bindPopup(`Your location within ${Intl.NumberFormat().format(0)} meters.`)
    }
  }, [map, permission])

  useEffect(() => {
    if (position) {
      userCircle.setLatLng(latLng(position.point.lat, position.point.lon))
      user
        .setLatLng(latLng(position.point.lat, position.point.lon))
        .setPopupContent(
          `Your location within ${Intl.NumberFormat().format(position.accuracy)} meters.`
        )
    }
  }, [position])
}

export { useTrackUser }
