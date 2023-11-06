import styled from 'styled-components'
import ReactColorA11y from 'react-color-a11y'
import { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react'
import { latLng } from 'leaflet'
import { Link } from 'react-router-dom'
import { toast } from '@busmap/components/toast'
import { Tooltip } from '@busmap/components/tooltip'
import { MapMarked } from '@busmap/components/icons/mapMarked'
import { Trash } from '@busmap/components/icons/trash'
import { PB20T, PB80T, PB10T, PB50T } from '@busmap/components/colors'

import { blinkStyles } from '../../../common.js'
import { useMap } from '../../../contexts/map.js'
import { useStorage, useStorageDispatch } from '../../../contexts/storage.js'
import { useHomeStop } from '../../../hooks/useHomeStop.js'
import { useTheme } from '../../../modules/settings/contexts/theme.js'
import { usePredictionsSettings } from '../../settings/contexts/predictions.js'
import { Details } from '../../../components/details.js'
import { Minutes } from '../../../components/predictionFormats/minutes.js'
import { Time } from '../../../components/predictionFormats/time.js'
import { groupBy, getPredsKey } from '../util.js'
import { MAX_FAVORITES } from '../common.js'

import type { MouseEvent } from 'react'
import type {
  WorkerMessage,
  PredictionsMap,
  AgencyRouteFavoritesGroup
} from '../types.js'
import type { Mode } from '../../../modules/settings/types.js'

const Empty = styled.div`
  display: grid;
  gap: 10px;

  p {
    margin: 0;
  }
`
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
`
const AgenciesWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const AgencySection = styled.section<{ mode: Mode }>`
  border: 2px solid ${PB80T};
  border-radius: 5px;

  h3 {
    font-size: 14px;
    font-style: italic;
    margin: 0;
    padding: 2px 3px;
    line-height: 1;
    background: ${PB80T};
    color: ${({ mode }) => (mode === 'light' ? PB20T : PB10T)};
  }
`
const RouteWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 3px;
`
const RouteSection = styled.section<{ routeColor: string; routeTextColor: string }>`
  border-radius: 5px;
  border: 1px solid ${({ routeColor }) => routeColor};

  h4 {
    font-size: 14px;
    font-weight: normal;
    margin: 0;
    padding: 2px 3px;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ routeTextColor }) => routeTextColor};
    background: ${({ routeColor }) => routeColor};
  }
`
const Article = styled.article<{ routeColor: string; mode: Mode }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
  border-bottom: 1px dashed ${({ routeColor }) => routeColor};

  &:last-child {
    border-bottom: none;
  }

  footer {
    > div {
      display: inline-block;
    }
  }

  header {
    > div {
      display: inline-block;
    }

    h5 {
      font-size: 16px;
      margin: 0;

      a {
        color: ${({ routeColor }) => routeColor};
      }
    }

    h6 {
      font-size: 12px;
      font-weight: normal;
      margin: 0;
    }

    &.fav-selected {
      > div {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      h5 {
        a {
          text-decoration: none;

          &,
          svg {
            cursor: auto;
          }
        }
      }
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: 6px;
    line-height: 1;

    li {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 15px;
      font-weight: bold;

      em {
        ${blinkStyles};
      }
    }

    li:last-child {
      span:last-child {
        display: none;
      }
    }
  }
`
const Favorites = memo(function Favorites() {
  const map = useMap()
  const workerRef = useRef<Worker>()
  const homeStop = useHomeStop()
  const { mode } = useTheme()
  const { favorites } = useStorage()
  const storageDispatch = useStorageDispatch()
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
  const onClickSelectedFavorite = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      const { lat, lon } = evt.currentTarget.dataset
      const latLon = latLng(Number(lat), Number(lon))

      map?.setView(latLon, Math.max(map.getZoom() ?? 1, 16))
    },
    [map]
  )

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
        favoritesByAgencyId: groupBy(
          favorites.slice(0, MAX_FAVORITES),
          ({ agency }) => agency.id
        )
      })
    }
  }, [favorites])

  return (
    <Section>
      <h2>Favorite Stops</h2>
      {!favorites.length ? (
        <Empty>
          <span>⭐⭐⭐</span>
          <p>
            You can select up to {MAX_FAVORITES} favorite stops from the bus selector tab.
            Their arrival or departure prediction times will be displayed here.
          </p>
          <span>⭐⭐⭐</span>
        </Empty>
      ) : (
        <>
          {favorites.length === MAX_FAVORITES && (
            <Details mode={mode}>
              <summary>Maximum favorites reached.</summary>
              <p>
                You have reached your maximum of {MAX_FAVORITES} favorite stops. To select
                another favorite stop you can remove a current favorite, or create an
                account to increase your maximum limit.
              </p>
            </Details>
          )}
          <AgenciesWrap>
            {Object.keys(agencyRouteGroup).map(agencyTitle => (
              <AgencySection key={agencyTitle} mode={mode}>
                <h3>{agencyTitle}</h3>
                <RouteWrap>
                  {Object.keys(agencyRouteGroup[agencyTitle]).map(routeTitle => {
                    const firstFav = agencyRouteGroup[agencyTitle][routeTitle][0]
                    const { color, textColor } = firstFav.route

                    return agencyRouteGroup[agencyTitle][routeTitle].map(fav => {
                      const isHomeStopFav =
                        fav.agency.id === homeStop?.params.agency &&
                        fav.route.id === homeStop?.params.route &&
                        fav.direction.id === homeStop?.params.direction &&
                        fav.stop.id === homeStop?.params.stop
                      const PredFormat = format === 'minutes' ? Minutes : Time
                      const preds =
                        predictionsMap[getPredsKey(agencyTitle, routeTitle, fav.stop.id)]

                      return (
                        <RouteSection
                          key={`${routeTitle}-${fav.stop.id}`}
                          routeColor={color}
                          routeTextColor={textColor}>
                          <h4 title={routeTitle}>{routeTitle}</h4>
                          <Article routeColor={color} mode={mode}>
                            <header
                              className={isHomeStopFav ? 'fav-selected' : undefined}>
                              <ReactColorA11y colorPaletteKey={mode}>
                                <h5>
                                  <Link
                                    to={`/stop/${fav.agency.id}/${fav.route.id}/${fav.direction.id}/${fav.stop.id}`}>
                                    {fav.stop.title}
                                  </Link>
                                </h5>
                                {isHomeStopFav && (
                                  <Tooltip title="Locate selected favorite.">
                                    <button
                                      onClick={onClickSelectedFavorite}
                                      data-lat={fav.stop.lat}
                                      data-lon={fav.stop.lon}>
                                      <MapMarked size="small" color={color} />
                                    </button>
                                  </Tooltip>
                                )}
                              </ReactColorA11y>
                              <h6>{fav.direction.title}</h6>
                            </header>
                            {preds?.length ? (
                              <ul>
                                {preds[0].values
                                  .slice(0, 3)
                                  .map(
                                    ({
                                      vehicle,
                                      epochTime,
                                      minutes,
                                      affectedByLayover
                                    }) => (
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
                            <footer>
                              <Tooltip title="Delete">
                                <button
                                  onClick={() => {
                                    storageDispatch({
                                      type: 'favoriteRemove',
                                      value: fav
                                    })
                                  }}>
                                  <Trash size="small" color={PB50T} />
                                </button>
                              </Tooltip>
                            </footer>
                          </Article>
                        </RouteSection>
                      )
                    })
                  })}
                </RouteWrap>
              </AgencySection>
            ))}
          </AgenciesWrap>
        </>
      )}
    </Section>
  )
})

export { Favorites }
