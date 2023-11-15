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

import { Pulse } from './pulse.js'

import { useLocation } from '../contexts/location.js'

import type { FC } from 'react'

interface UserLocatorProps {
  withDistance?: boolean
}

const btn = `
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`
const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  header + & {
    margin: 18px 0 6px;
  }
`
const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;

  p {
    margin: 0;
    font-size: 12px;
    font-style: italic;
    font-weight: 600;
  }
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

  > div:last-child {
    line-height: 1;
  }
`
const StopButton = styled.button`
  ${btn};
  padding: 2px 1px;
  font-weight: 600;
  color: #014361;
  text-align: start;

  &:hover {
    background: #014361cc;
    color: white;
  }
`
const StreetViewButton = styled.button`
  ${btn};
`
const UserLocator: FC<UserLocatorProps> = ({ withDistance = false }) => {
  const map = useMap()
  const { stop } = useGlobals()
  const { position, permission } = useLocation()
  const onClick = useCallback(() => {
    if (position && map) {
      map.setView(
        latLng(position.point.lat, position.point.lon),
        Math.max(map.getZoom() ?? 1, 16)
      )
    }
  }, [position, map])
  const onClickLocateStop = useCallback(() => {
    if (map && stop) {
      const { lat, lon } = stop
      const latLon = latLng(lat, lon)

      map.setView(latLon, Math.max(map.getZoom(), 16))
    }
  }, [map, stop])

  if (permission !== 'granted') {
    return null
  }

  if (withDistance) {
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
          <Alert icon={<Route color={PB80T} cursor="auto" />} fullWidth>
            <AlertWrap>
              <p>
                {Intl.NumberFormat(['en-US', 'es-US', 'es-CL'], {
                  maximumSignificantDigits: sigDig
                }).format(distanceInMiles)}{' '}
                miles away from{' '}
                <StopButton onClick={onClickLocateStop}>{stop.title}.</StopButton>
              </p>
              <Tooltip title="Locate me.">
                <StreetViewButton onClick={onClick}>
                  <StreetView size="small" color={SO40T} />
                </StreetViewButton>
              </Tooltip>
            </AlertWrap>
          </Alert>
        </Wrap>
      )
    }

    return null
  }

  return (
    <Info>
      <Pulse />
      <p>Monitoring your location.</p>
      <Tooltip title="Locate me.">
        <button onClick={onClick}>
          <StreetView size="small" color={SO40T} />
        </button>
      </Tooltip>
    </Info>
  )
}

export { UserLocator }
