import { useState, useCallback, useMemo, memo, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, generatePath } from 'react-router-dom'
import { latLng, latLngBounds } from 'leaflet'
import styled from 'styled-components'

import { Page } from './page.js'
import { Agencies } from './selectors/agencies.js'
import { Routes } from './selectors/routes.js'
import { Directions } from './selectors/directions.js'
import { Stops } from './selectors/stops.js'
import { SelectorError } from './error/selector.js'

import { useGlobals } from '../globals.js'
import { useMap } from '../contexts/map.js'
import { useDocMeta } from '../hooks/useDocMeta.js'
import { useHomeStop } from '../hooks/useHomeStop.js'
import { useVehiclesDispatch } from '../contexts/vehicles.js'
import { getAll as getAllRoutes, get as getRoute } from '../api/rb/route.js'

import type { Agency, RouteName, Direction, Stop } from '../types.js'

interface BusSelectorProps {
  agencies: Agency[]
}

const getFirstDataError = (errors: (Error | unknown)[]) => {
  for (const error of errors) {
    if (error instanceof Error) {
      return error
    }
  }
}
const Form = styled.form`
  display: grid;
  gap: 10px;
`
const BusSelector = memo(function BusSelector({ agencies }: BusSelectorProps) {
  const map = useMap()
  const navigate = useNavigate()
  const homeStop = useHomeStop()
  const bookmark = useRef<Record<string, string | undefined>>({})
  const [routeName, setRouteName] = useState<RouteName>()
  const { dispatch, agency, route, direction, stop } = useGlobals()
  const vehiclesDispatch = useVehiclesDispatch()
  const stops = useMemo(() => {
    if (direction && route) {
      return route.stops.filter(({ id }) => direction.stops.includes(id))
    }

    if (route) {
      return route.stops
    }

    return []
  }, [route, direction])
  const {
    data: routes,
    error: routesError,
    isLoading: isRoutesLoading
  } = useQuery({
    queryKey: ['routes', agency?.id],
    queryFn: () => getAllRoutes(agency?.id),
    enabled: Boolean(agency),
    staleTime: 20 * 60 * 1000
  })
  const {
    data: routeConfig,
    error: routeError,
    isLoading: isRouteLoading
  } = useQuery({
    /**
     * Use two attributes from a route to prevent collisions across agencies.
     * Not using agency id here to prevent prematurely triggering a route
     * request with a mismatching agency/route pair resulting in 404's.
     */
    queryKey: ['route', routeName?.id, routeName?.title],
    queryFn: () => getRoute(agency?.id, routeName?.id),
    enabled: Boolean(agency) && Boolean(routeName),
    staleTime: 20 * 60 * 1000
  })
  const onSelectAgency = useCallback(
    (selected: Agency) => {
      dispatch({
        type: 'agency',
        value: selected
      })
      navigate(generatePath('/stop/:agency', { agency: selected.id }), { replace: true })
    },
    [dispatch, navigate]
  )
  const onSelectRoute = useCallback(
    (selected: RouteName) => {
      if (agency) {
        setRouteName(selected)
        navigate(
          generatePath('/stop/:agency/:route', { agency: agency.id, route: selected.id }),
          { replace: true }
        )
      }
    },
    [agency, navigate]
  )
  const onSelectDirection = useCallback(
    (selected: Direction) => {
      if (agency && route) {
        dispatch({
          type: 'direction',
          value: selected
        })
        vehiclesDispatch({ type: 'reset' })
        navigate(
          generatePath('/stop/:agency/:route/:direction', {
            agency: agency.id,
            route: route.id,
            direction: selected.id
          }),
          { replace: true }
        )
      }
    },
    [dispatch, vehiclesDispatch, navigate, agency, route]
  )
  const onSelectStop = useCallback(
    (selected: Stop) => {
      if (agency && route && direction) {
        dispatch({
          type: 'stop',
          value: selected
        })
        navigate(
          generatePath('/stop/:agency/:route/:direction/:stop', {
            agency: agency.id,
            route: route.id,
            direction: direction.id,
            stop: selected.id
          }),
          { replace: true }
        )
      }
    },
    [dispatch, navigate, agency, route, direction]
  )
  const onClearStop = useCallback(() => {
    if (agency && route && direction) {
      dispatch({ type: 'stop', value: undefined })
      vehiclesDispatch({ type: 'reset' })
      navigate(
        generatePath('/stop/:agency/:route/:direction', {
          agency: agency.id,
          route: route.id,
          direction: direction.id
        }),
        { replace: true }
      )
    }
  }, [navigate, dispatch, vehiclesDispatch, agency, route, direction])
  const error = getFirstDataError([routesError, routeError])
  const isLoading = isRoutesLoading || isRouteLoading

  /**
   * Update page title and description.
   */
  useDocMeta()

  useEffect(() => {
    if (routes) {
      if (bookmark.current.route) {
        const route = routes.find(({ id }) => id === bookmark.current.route)

        if (route) {
          setRouteName(route)
        }

        delete bookmark.current.route
      } else {
        // When agency changes, use the first route as the default
        setRouteName(routes[0])
      }
    }
  }, [routes])

  useEffect(() => {
    if (routeConfig) {
      const fitRouteBounds = () => {
        const { sw, ne } = routeConfig.bounds

        map?.fitBounds(latLngBounds(latLng(sw.lat, sw.lon), latLng(ne.lat, ne.lon)))
      }

      dispatch({ type: 'route', value: routeConfig })
      vehiclesDispatch({ type: 'set', value: undefined })

      if (bookmark.current.direction) {
        const direction = routeConfig.directions.find(
          ({ id }) => id === bookmark.current.direction
        )

        if (direction) {
          dispatch({ type: 'direction', value: direction })
        }

        delete bookmark.current.direction

        if (bookmark.current.stop) {
          const stop = routeConfig.stops.find(({ id }) => id === bookmark.current.stop)

          if (stop) {
            dispatch({ type: 'stop', value: stop })
          }

          delete bookmark.current.stop
        } else {
          fitRouteBounds()
        }
      } else {
        fitRouteBounds()
        dispatch({ type: 'direction', value: routeConfig.directions[0] })
      }
    }
  }, [routeConfig, map, dispatch, vehiclesDispatch])

  useEffect(() => {
    if (homeStop) {
      const { params } = homeStop
      /**
       * This is where selector state and url params
       * are all in synnc except the stop params/state.
       *
       * Make sure stop is not falsy so that clearing a
       * selected stop does not trigger this branch,
       * and only navigation or changing selections does.
       */
      if (
        stop &&
        agency?.id === params.agency &&
        routeName?.id === params.route &&
        direction?.id === params.direction
      ) {
        const stp = route?.stops.find(({ id }) => id === params.stop)

        if (stp) {
          dispatch({ type: 'stop', value: stp })
        }
      } else {
        /**
         * From here check for out of sync state/param values one
         * by one, update the associated state and bookmark the
         * remaining, async values from the url params.
         */
        if (agency?.id !== params.agency) {
          const stopAgency = agencies.find(({ id }) => id === params.agency)

          if (stopAgency) {
            bookmark.current.route = params.route
            bookmark.current.direction = params.direction
            bookmark.current.stop = params.stop
            dispatch({ type: 'agency', value: stopAgency })
          }
        } else if (routeName?.id !== params.route) {
          const stopRouteName = routes?.find(({ id }) => id === params.route)

          if (stopRouteName) {
            bookmark.current.direction = params.direction
            bookmark.current.stop = params.stop
            setRouteName(stopRouteName)
          }
        } else if (direction?.id !== params.direction) {
          const stopDirection = route?.directions.find(
            ({ id }) => id === params.direction
          )
          const stopStop = route?.stops.find(({ id }) => id === params.stop)

          if (stopDirection && stopStop) {
            dispatch({ type: 'direction', value: stopDirection })
            dispatch({ type: 'stop', value: stopStop })
          }
        } else {
          const stopStop = route?.stops.find(({ id }) => id === params.stop)

          if (stopStop) {
            dispatch({ type: 'stop', value: stopStop })
          }
        }
      }
    }
  }, [dispatch, homeStop, agencies, agency, routeName, routes, route, direction, stop])

  return (
    <Page title="Bus Selector">
      {error instanceof Error && <SelectorError err={error} />}
      <Form
        onSubmit={evt => {
          evt.preventDefault()
        }}>
        <Agencies
          agencies={agencies}
          selected={agency}
          onSelect={onSelectAgency}
          isDisabled={isLoading}
        />
        <Routes
          routes={routes}
          selected={routeName}
          onSelect={onSelectRoute}
          isDisabled={isLoading || !agency}
        />
        <Directions
          directions={route?.directions}
          selected={direction}
          onSelect={onSelectDirection}
          isDisabled={isLoading || !agency || !route}
        />
        <Stops
          stops={stops}
          selected={stop}
          onClear={onClearStop}
          onSelect={onSelectStop}
          isDisabled={isLoading || !agency || !route || !direction}
        />
      </Form>
    </Page>
  )
})

export { BusSelector }
export type { BusSelectorProps }
