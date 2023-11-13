import styled from 'styled-components'
import { useCallback } from 'react'
import { latLng } from 'leaflet'
import { Tooltip } from '@busmap/components/tooltip'
import { Alert } from '@busmap/components/alert'
import { StreetView } from '@busmap/components/icons/streetView'
import { Route } from '@busmap/components/icons/route'
import { SO40T, PB80T } from '@busmap/components/colors'

import { useMap } from '@core/contexts/map.js'
import { useGlobals } from '@core/globals.js'

import { useLocation } from '../contexts/location.js'

import type { FC } from 'react'

interface UserLocatorProps {
  asAlert?: boolean
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const AlertWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  p {
    margin: 0;
    line-height: 1;
  }
`
const UserLocator: FC<UserLocatorProps> = ({ asAlert = false }) => {
  const map = useMap()
  const { stop } = useGlobals()
  const { position } = useLocation()
  const onClick = useCallback(() => {
    if (position && map) {
      map.setView(
        latLng(position.point.lat, position.point.lon),
        Math.max(map.getZoom(), 16)
      )
    }
  }, [position, map])

  if (asAlert) {
    if (stop && map && position) {
      const distanceInMiles =
        map.distance(
          latLng(position.point.lat, position.point.lon),
          latLng(stop.lat, stop.lon)
        ) / 1609
      const digits = Math.round(distanceInMiles).toString().length
      const sigDig = digits > 2 ? digits : 2

      return (
        <Wrap>
          <Alert type="info" icon={<Route color={PB80T} />}>
            <AlertWrap>
              <p>
                {Intl.NumberFormat(['en-US', 'es-US', 'es-CL'], {
                  maximumSignificantDigits: sigDig
                }).format(distanceInMiles)}{' '}
                miles away from <strong>{stop.title}</strong>.
              </p>
              <Tooltip title="Locate me.">
                <button onClick={onClick}>
                  <StreetView size="small" color={SO40T} />
                </button>
              </Tooltip>
            </AlertWrap>
          </Alert>
        </Wrap>
      )
    }

    return null
  }

  return (
    <Wrap>
      <Tooltip title="Locate me.">
        <button onClick={onClick}>
          <StreetView size="small" color={SO40T} />
        </button>
      </Tooltip>
    </Wrap>
  )
}

export { UserLocator }
