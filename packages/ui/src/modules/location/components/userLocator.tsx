import styled from 'styled-components'
import { useCallback } from 'react'
import { latLng } from 'leaflet'
import { StreetView } from '@busmap/components/icons/streetView'
import { SO40T } from '@busmap/components/colors'

import { useMap } from '@core/contexts/map.js'

import { useLocation } from '../contexts/location.js'

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
`
const UserLocator = () => {
  const map = useMap()
  const { position } = useLocation()
  const onClick = useCallback(() => {
    if (position && map) {
      map.setView(
        latLng(position.point.lat, position.point.lon),
        Math.max(map.getZoom(), 16)
      )
    }
  }, [position, map])

  return (
    <Button onClick={onClick}>
      <StreetView size="small" color={SO40T} />
      <span>Locate me</span>
    </Button>
  )
}

export { UserLocator }
