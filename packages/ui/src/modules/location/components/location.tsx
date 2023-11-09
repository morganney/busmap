import styled from 'styled-components'
import { memo, useEffect, useMemo } from 'react'
import { latLng, latLngBounds } from 'leaflet'
import { useQuery } from '@tanstack/react-query'

import { get as getRoute } from '@core/api/rb/route.js'
import { Loading } from '@core/components/loading.js'
import { Minutes } from '@core/components/predictionFormats/minutes.js'
import { useMap } from '@core/contexts/map.js'
import { useHomeStop } from '@core/hooks/useHomeStop.js'
import { groupBy } from '@module/util.js'
import {
  AgenciesWrap,
  AgencySection,
  RouteWrap,
  RouteSection,
  StopArticle
} from '@module/components.js'
import { useTheme } from '@module/settings/contexts/theme.js'

import { get as getPredictions } from '../api/predictions.js'
import { useLocation } from '../contexts/location.js'
import { useLocateUser } from '../hooks/useLocateUser.js'

import type { Route, Prediction } from '@core/types.js'

interface LocationProps {
  active: boolean
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h2 {
    font-size: 22px;
    margin: 0;
  }

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
  const { permission, position } = useLocation()
  const { data: predictions } = useQuery({
    queryKey: ['location', [position?.lat, position?.lon]],
    queryFn: () => getPredictions(position),
    enabled: permission === 'granted'
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

    return predictions
  }, [predictions])
  const { data: routeConfigs } = useQuery({
    queryKey: ['configs', position?.lat, position?.lon],
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
    enabled: Boolean(group)
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

  if (permission === 'denied') {
    return <p>Permission denied.</p>
  }

  if (group && routeConfigs) {
    if (!Object.keys(group).length) {
      return <p>No predictions available at this time for your location.</p>
    }

    return (
      <Section>
        <h2>Nearby Stops</h2>
        <AgenciesWrap>
          {Object.keys(group).map(agencyTitle => (
            <AgencySection key={agencyTitle} mode={mode}>
              <h3>{agencyTitle}</h3>
              <RouteWrap>
                {Object.keys(group[agencyTitle]).map((routeTitle, idx) => {
                  const route = routeConfigs[idx]

                  return group[agencyTitle][routeTitle].map(pred => {
                    return (
                      <RouteSection
                        key={`${pred.route.id}-${pred.stop.id}`}
                        routeColor={route.color}
                        routeTextColor={route.textColor}>
                        <h4>{routeTitle}</h4>
                        <StopArticle routeColor={route.color} mode={mode}>
                          <header>
                            <h5>{pred.stop.title}</h5>
                            {pred.values[0]?.direction.title && (
                              <h6>{pred.values[0].direction.title}</h6>
                            )}
                          </header>
                          <ul>
                            {pred.values.map(({ minutes, affectedByLayover }, pidx) => (
                              <li key={`${minutes}-${pidx}`}>
                                {minutes === 0 ? (
                                  <em>Now</em>
                                ) : (
                                  <Minutes
                                    minutes={minutes}
                                    affectedByLayover={affectedByLayover}
                                  />
                                )}
                                <span>•</span>
                              </li>
                            ))}
                          </ul>
                          <footer>
                            <em>{pred.stop.distance}</em>
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
