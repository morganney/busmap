import styled from 'styled-components'
import ReactColorA11y from 'react-color-a11y'
import { memo, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { latLng, latLngBounds } from 'leaflet'
import { useQuery } from '@tanstack/react-query'
import { Tooltip } from '@busmap/components/tooltip'
import { Alert } from '@busmap/components/alert'
import { MapMarked } from '@busmap/components/icons/mapMarked'

import { queryClient } from '@core/queryClient.js'
import { get as getRoute } from '@core/api/rb/route.js'
import { Page } from '@core/components/page.js'
import { Loading } from '@core/components/loading.js'
import { Minutes } from '@core/components/predictionFormats/minutes.js'
import { Time } from '@core/components/predictionFormats/time.js'
import { useMap } from '@core/contexts/map.js'
import { useHomeStop } from '@core/hooks/useHomeStop.js'
import { usePredictionsSettings } from '@module/settings/contexts/predictions.js'
import { groupBy } from '@module/util.js'
import {
  AgenciesWrap,
  AgencySection,
  RouteWrap,
  RouteSection,
  StopArticle
} from '@module/components.js'
import { useTheme } from '@module/settings/contexts/theme.js'
import { FavoriteStop } from '@module/favorites/components/favoriteStop.js'

import { UserLocator } from './userLocator.js'

import { get as getPredictions } from '../api/predictions.js'
import { useLocation } from '../contexts/location.js'
import { useLocateUser } from '../hooks/useLocateUser.js'
import { useTrackUser } from '../hooks/useTrackUser.js'

import type { MouseEvent } from 'react'
import type { Route, Prediction, RouteName, Stop } from '@core/types.js'

interface LocationProps {
  active: boolean
}
interface LocationPrediction extends Prediction {
  route: RouteName & {
    color: string
    textColor: string
  }
  direction: {
    id: string
    title: string
  }
  stop: Stop & { distance: number | null }
}
type Presentation = Record<string, Record<string, LocationPrediction[]>>

const Section = styled(Page)`
  button {
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
  }

  footer {
    em {
      font-size: 14px;
    }
  }
`
const Location = memo(function Location({ active = false }: LocationProps) {
  const map = useMap()
  const homeStop = useHomeStop()
  const { mode } = useTheme()
  const { format } = usePredictionsSettings()
  const { permission, position } = useLocation()
  const presentation = useRef<Presentation>()
  const { data: predictions, error: predictionsError } = useQuery({
    queryKey: ['location', [position?.point.lat, position?.point.lon]],
    queryFn: () => getPredictions(position?.point),
    enabled: Boolean(permission === 'granted' && active && position?.point),
    refetchOnWindowFocus: true,
    refetchInterval: 10_000
  })
  const group = useMemo(() => {
    if (predictions) {
      const outer: Record<string, Record<string, Prediction[]>> = {}
      const inner = groupBy(predictions, pred => pred.agency.title)

      Object.keys(inner).forEach(agency => {
        outer[agency] = groupBy(inner[agency], pred => pred.route.title)
      })

      return outer
    }
  }, [predictions])
  const { data: routeConfigs, error: routeConfigsError } = useQuery({
    // Make sure the route configs update when the group data does
    queryKey: ['configs', ...Object.keys(group ?? {})],
    queryFn: () => {
      const requests: Promise<Route>[] = []

      if (group) {
        Object.keys(group).forEach(agency => {
          Object.keys(group[agency]).forEach(route => {
            // Use the first prediction to get the agency and route IDs.
            const pred = group[agency][route][0]

            if (pred) {
              requests.push(getRoute(pred.agency.id, pred.route.id))
            }
          })
        })
      }

      return Promise.all(requests)
    },
    enabled: Boolean(group),
    staleTime: 20 * 60 * 1000
  })
  const uiGroup = useMemo(() => {
    if (group && routeConfigs) {
      const pres: Presentation = {}

      Object.keys(group).forEach(agencyTitle => {
        pres[agencyTitle] = {}
        Object.keys(group[agencyTitle]).forEach((routeTitle, idx) => {
          const route = routeConfigs[idx]
          const locationPreds: LocationPrediction[] = []

          if (route) {
            // Add additional data like colors and direction
            group[agencyTitle][routeTitle].forEach(pred => {
              const dir = route.directions.find(dir => dir.stops.includes(pred.stop.id))
              const stop = route.stops.find(stop => stop.id === pred.stop.id)

              if (stop && dir) {
                locationPreds.push({
                  ...pred,
                  route: {
                    ...pred.route,
                    color: route.color,
                    textColor: route.textColor
                  },
                  direction: {
                    id: dir.id,
                    title: dir.title ?? dir.shortTitle ?? ''
                  },
                  stop: {
                    ...stop,
                    distance: pred.stop.distance
                  }
                })
              }
            })
          }

          pres[agencyTitle][routeTitle] = locationPreds
        })
      })

      presentation.current = pres
    }

    // Show any previous (stale) predictions while position or routeConfigs are loading
    return presentation.current
  }, [group, routeConfigs])
  const onClickSelectedNearby = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      const { lat, lon } = evt.currentTarget.dataset
      const latLon = latLng(Number(lat), Number(lon))

      map?.setView(latLon, Math.max(map.getZoom() ?? 1, 16))
    },
    [map]
  )
  const PredFormat = format === 'minutes' ? Minutes : Time

  useLocateUser(active && permission !== 'denied')

  useTrackUser()

  useEffect(() => {
    if (active && permission === 'denied' && !homeStop && map) {
      // Roughly North America (USA, Cananda, Mexico)
      map.fitBounds(
        latLngBounds(latLng(6.089467, -128.009169), latLng(73.28682, -78.506175))
      )
    }
  }, [active, homeStop, permission, map])

  useEffect(() => {
    if (Array.isArray(routeConfigs)) {
      routeConfigs.forEach(route => {
        queryClient.setQueryData(['route', route.id, route.title], route)
      })
    }
  }, [routeConfigs])

  if (permission === 'denied') {
    return (
      <Alert type="warning">
        <strong>Location permission denied.</strong> Check your OS or browser settings.
      </Alert>
    )
  }

  if (predictionsError || routeConfigsError) {
    return <Alert type="error">There was an error getting data for your location.</Alert>
  }

  if (uiGroup) {
    return (
      <Section title="Nearby Stops">
        <UserLocator />
        {predictions && !predictions.length && (
          <p>No predictions available at this time for your location.</p>
        )}
        <AgenciesWrap>
          {Object.keys(uiGroup).map(agencyTitle => (
            <AgencySection key={agencyTitle} mode={mode}>
              <h3>{agencyTitle}</h3>
              <RouteWrap>
                {Object.keys(uiGroup[agencyTitle]).map(routeTitle => {
                  return uiGroup[agencyTitle][routeTitle].map(pred => {
                    const { color, textColor } = pred.route
                    const isHomeStopPred =
                      pred.agency.id === homeStop?.params.agency &&
                      pred.route.id === homeStop?.params.route &&
                      pred.direction.id === homeStop?.params.direction &&
                      pred.stop.id === homeStop?.params.stop

                    return (
                      <RouteSection
                        key={`${pred.route.id}-${pred.stop.id}`}
                        routeColor={color}
                        routeTextColor={textColor}>
                        <h4>{routeTitle}</h4>
                        <StopArticle
                          mode={mode}
                          routeColor={color}
                          className={isHomeStopPred ? 'selected' : undefined}>
                          <header>
                            <ReactColorA11y colorPaletteKey={mode}>
                              <h5>
                                <Link
                                  to={`/stop/${pred.agency.id}/${pred.route.id}/${pred.direction.id}/${pred.stop.id}`}>
                                  {pred.stop.title}
                                </Link>
                              </h5>
                              {isHomeStopPred && (
                                <Tooltip title="Locate selected stop.">
                                  <button
                                    data-lat={pred.stop.lat}
                                    data-lon={pred.stop.lon}
                                    onClick={onClickSelectedNearby}>
                                    <MapMarked size="small" color={color} />
                                  </button>
                                </Tooltip>
                              )}
                            </ReactColorA11y>
                            {pred.values[0]?.direction.title && (
                              <h6>{pred.values[0].direction.title}</h6>
                            )}
                          </header>
                          <ul>
                            {pred.values.map(
                              ({ minutes, epochTime, affectedByLayover }, pidx) => (
                                <li key={`${minutes}-${pidx}`}>
                                  {minutes === 0 ? (
                                    <em>Now</em>
                                  ) : (
                                    <PredFormat
                                      minutes={minutes}
                                      epochTime={epochTime}
                                      affectedByLayover={affectedByLayover}
                                    />
                                  )}
                                  <span>•</span>
                                </li>
                              )
                            )}
                          </ul>
                          <footer>
                            <ul>
                              <li>
                                <em>{pred.stop.distance}</em>
                              </li>
                              <li>
                                <FavoriteStop
                                  size="small"
                                  selection={{
                                    agency: pred.agency,
                                    route: pred.route,
                                    direction: pred.direction,
                                    stop: pred.stop
                                  }}
                                />
                              </li>
                            </ul>
                          </footer>
                        </StopArticle>
                      </RouteSection>
                    )
                  })
                })}
              </RouteWrap>
            </AgencySection>
          ))}
        </AgenciesWrap>
      </Section>
    )
  }

  return <Loading text="Attempting to locate your position..." />
})

export { Location }
