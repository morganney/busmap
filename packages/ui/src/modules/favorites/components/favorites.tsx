import styled from 'styled-components'
import ReactColorA11y from 'react-color-a11y'
import { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react'
import { latLng } from 'leaflet'
import { Link } from 'react-router-dom'
import { toast } from '@busmap/components/toast'
import { Tooltip } from '@busmap/components/tooltip'
import { Alert } from '@busmap/components/alert'
import { MapMarked } from '@busmap/components/icons/mapMarked'
import { Trash } from '@busmap/components/icons/trash'
import { PB50T, PB90T, PB20T } from '@busmap/components/colors'

import { useGlobals } from '@core/globals.js'
import { useMap } from '@core/contexts/map.js'
import { useStorage, useStorageDispatch } from '@core/contexts/storage.js'
import { useHomeStop } from '@core/hooks/useHomeStop.js'
import { Page } from '@core/components/page.js'
import { PageTabButton } from '@core/components/pageTabButton.js'
import { Details } from '@core/components/details.js'
import { Minutes } from '@core/components/predictionFormats/minutes.js'
import { Time } from '@core/components/predictionFormats/time.js'
import { useTheme } from '@module/settings/contexts/theme.js'
import { usePredictionsSettings } from '@module/settings/contexts/predictions.js'
import {
  AgenciesWrap,
  AgencySection,
  RouteWrap,
  RouteSection,
  StopArticle
} from '@module/components.js'
import { groupBy } from '@module/util.js'

import { getPredsKey } from '../util.js'
import { MAX_FAVORITES, MAX_USER_FAVORITES } from '../common.js'
import { remove } from '../api/delete.js'

import type { MouseEvent } from 'react'
import type { Mode } from '@busmap/common/types/settings'
import type { Favorite } from '@busmap/common/types/favorites'
import type {
  ErrorsMap,
  WorkerMessage,
  PredictionsMap,
  AgencyRouteFavoritesGroup
} from '../types.js'

const Empty = styled.div`
  display: grid;
  gap: 10px;

  p {
    margin: 0;
  }
`
const Section = styled(Page)<{ mode: Mode }>`
  button {
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ mode }) => (mode === 'light' ? PB20T : PB90T)};

    &.link {
      font-weight: 700;
    }
  }
`
const Favorites = memo(function Favorites() {
  const { user } = useGlobals()
  const map = useMap()
  const workerRef = useRef<Worker>()
  const homeStop = useHomeStop()
  const { mode } = useTheme()
  const { favorites } = useStorage()
  const storageDispatch = useStorageDispatch()
  const { format } = usePredictionsSettings()
  const [errors, setErrors] = useState<ErrorsMap>({})
  const [predictions, setPredictions] = useState<PredictionsMap>({})
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
  const onClickDeleteFavorite = useCallback(
    async (fav: Favorite) => {
      storageDispatch({
        type: 'favoriteRemove',
        value: fav
      })

      if (user) {
        try {
          const removed = await remove(fav)

          if (removed) {
            toast({ type: 'info', message: 'Favorite removed.' })
          }
        } catch (err) {
          toast({ type: 'error', message: 'Error removing favorite.' })
        }
      }
    },
    [storageDispatch, user]
  )
  const maximum = user ? MAX_USER_FAVORITES : MAX_FAVORITES
  const PredFormat = format === 'minutes' ? Minutes : Time

  useEffect(() => {
    workerRef.current = new Worker(new URL('../worker.ts', import.meta.url), {
      type: 'module',
      name: 'favorites'
    })

    workerRef.current.addEventListener('message', (evt: MessageEvent<WorkerMessage>) => {
      if (!evt.data.error) {
        setPredictions(evt.data.predictions)
        setErrors(evt.data.errors)
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
      const group = groupBy(favorites.slice(0, maximum), ({ agency }) => agency.id)

      workerRef.current.postMessage({
        action: 'update',
        favoritesByAgencyId: group
      })
    }
  }, [favorites, maximum])

  return (
    <Section title="Favorite Stops" mode={mode}>
      {!favorites.length ? (
        <Empty>
          <span>⭐⭐⭐</span>
          {user ? (
            <p>
              {user.givenName}, you can select up to {MAX_USER_FAVORITES} favorite stops
              across any number of transit agencies from the{' '}
              <PageTabButton page="select">Selector</PageTabButton> or{' '}
              <PageTabButton page="locate">Nearby</PageTabButton> tabs.
            </p>
          ) : (
            <>
              <p>
                You can select up to {MAX_FAVORITES} favorite stops from the{' '}
                <PageTabButton page="select">Selector</PageTabButton> or{' '}
                <PageTabButton page="locate">Nearby</PageTabButton> tabs.
              </p>
              <p>
                <PageTabButton page="signin">Sign in with Google</PageTabButton> to save
                more favorite stops.
              </p>
            </>
          )}
          <p>The predicted arrival or departure times will be displayed here.</p>
          <span>⭐⭐⭐</span>
        </Empty>
      ) : (
        <>
          {favorites.length === maximum && (
            <Details mode={mode}>
              <summary>Maximum favorites reached.</summary>
              <p>
                You have reached your maximum of {maximum} favorite stops. To select
                another favorite stop you can remove a current favorite
                {user
                  ? ''
                  : `, or sign in to increase your maximum limit to ${MAX_USER_FAVORITES}`}
                .
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
                      const preds =
                        predictions[getPredsKey(agencyTitle, routeTitle, fav.stop.id)]

                      return (
                        <RouteSection
                          key={`${routeTitle}-${fav.stop.id}`}
                          routeColor={color}
                          routeTextColor={textColor}>
                          <h4 title={routeTitle}>{routeTitle}</h4>
                          <StopArticle
                            mode={mode}
                            routeColor={color}
                            className={isHomeStopFav ? 'selected' : undefined}>
                            <header>
                              <ReactColorA11y colorPaletteKey={mode}>
                                <h5>
                                  <Link
                                    data-testid="favoriteLink"
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
                            ) : errors[fav.agency.id] ? (
                              <Alert type="error" variant="outlined">
                                Error loading predictions.
                              </Alert>
                            ) : (
                              <span>No predictions.</span>
                            )}
                            <footer>
                              <Tooltip title="Delete">
                                <button onClick={() => onClickDeleteFavorite(fav)}>
                                  <Trash size="small" color={PB50T} />
                                </button>
                              </Tooltip>
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
        </>
      )}
    </Section>
  )
})

export { Favorites }
