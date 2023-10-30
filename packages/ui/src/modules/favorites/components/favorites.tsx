import styled from 'styled-components'
import { useEffect, useState, useMemo, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from '@busmap/components/toast'
import { PB70T } from '@busmap/components/colors'

import { useStorage } from '../../../contexts/storage.js'
import { usePredictionsSettings } from '../../settings/contexts/predictions.js'
import { Minutes } from '../../../components/predictionFormats/minutes.js'
import { Time } from '../../../components/predictionFormats/time.js'
import { groupBy, getPredsKey } from '../util.js'

import type {
  WorkerMessage,
  PredictionsMap,
  AgencyRouteFavoritesGroup
} from '../types.js'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h2 {
    font-size: 22px;
    margin: 0;
  }
`
const AgencySection = styled.section`
  display: flex;
  flex-direction: column;
  border: 2px solid ${PB70T};

  h3 {
    font-size: 14px;
    font-weight: normal;
    margin: 0;
    background: ${PB70T};
  }
`
const RouteSection = styled.section<{ routeColor: string; routeTextColor: string }>`
  display: flex;
  flex-direction: column;
  border: 2px solid ${({ routeColor }) => routeColor};

  h4 {
    font-size: 14px;
    font-weight: normal;
    margin: 0;
    color: ${({ routeTextColor }) => routeTextColor};
    background: ${({ routeColor }) => routeColor};
  }
`
const Article = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;

  h5 {
    font-size: 16px;
    margin: 0;

    a {
      color: black;
    }
  }

  h6 {
    font-size: 12px;
    font-weight: normal;
    margin: 0;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: 4px;

    li {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    li:last-child {
      span:last-child {
        display: none;
      }
    }
  }
`
const Favorites = memo(function Favorites() {
  const workerRef = useRef<Worker>()
  const { favorites } = useStorage()
  const { format } = usePredictionsSettings()
  const [predictionsMap, setPredictionsMap] = useState<PredictionsMap>({})
  const agencyRouteGroup = useMemo(() => {
    const outer: AgencyRouteFavoritesGroup = {}

    if (favorites) {
      const inner = groupBy(favorites, fav => fav.agency.title)

      Object.keys(inner).forEach(agency => {
        outer[agency] = groupBy(inner[agency], fav => fav.route.title)
      })
    }

    return outer
  }, [favorites])

  useEffect(() => {
    workerRef.current = new Worker(new URL('../worker.ts', import.meta.url), {
      type: 'module',
      name: 'favorites'
    })

    workerRef.current.addEventListener('message', (evt: MessageEvent<WorkerMessage>) => {
      if (!evt.data.error) {
        setPredictionsMap(evt.data.predictionsMap)
      }

      if (evt.data.error) {
        toast({ type: 'error', message: 'Error loading favorites.' })
      }
    })

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    if (favorites && workerRef.current) {
      workerRef.current.postMessage({
        action: 'update',
        favoritesByAgencyId: groupBy(favorites, ({ agency }) => agency.id)
      })
    }
  }, [favorites])

  return (
    <Section>
      <h2>Favorite Stops</h2>
      {!favorites.length ? (
        <div>⭐ You can select your favorite stops from the bus selector tab. ⭐</div>
      ) : (
        Object.keys(agencyRouteGroup).map(agencyTitle => (
          <AgencySection key={agencyTitle}>
            <h3>{agencyTitle}</h3>
            {Object.keys(agencyRouteGroup[agencyTitle]).map(routeTitle => {
              const firstFav = agencyRouteGroup[agencyTitle][routeTitle][0]
              const { color, textColor } = firstFav.route

              return (
                <RouteSection
                  key={routeTitle}
                  routeColor={color}
                  routeTextColor={textColor}>
                  <h4>{routeTitle}</h4>
                  {agencyRouteGroup[agencyTitle][routeTitle].map((fav, idx) => {
                    const PredFormat = format === 'minutes' ? Minutes : Time
                    const preds =
                      predictionsMap[getPredsKey(agencyTitle, routeTitle, fav.stop.id)]

                    return (
                      <Article key={`${fav.stop.id}-${idx}`}>
                        <header>
                          <h5>
                            <Link
                              to={`/bus/${fav.agency.id}/${fav.route.id}/${fav.direction.id}/${fav.stop.id}`}>
                              {fav.stop.title}
                            </Link>
                          </h5>
                          <h6>{fav.direction.title}</h6>
                        </header>
                        {preds?.length ? (
                          <ul>
                            {preds[0].values
                              .slice(0, 3)
                              .map(
                                ({ vehicle, epochTime, minutes, affectedByLayover }) => (
                                  <li key={`${epochTime}-${vehicle.id}`}>
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
                        ) : (
                          <span>No predictions.</span>
                        )}
                      </Article>
                    )
                  })}
                </RouteSection>
              )
            })}
          </AgencySection>
        ))
      )}
    </Section>
  )
})

export { Favorites }
