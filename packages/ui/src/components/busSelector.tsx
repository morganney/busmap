import { useState, useCallback, useMemo, memo, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, generatePath, useMatches } from 'react-router-dom'
import styled from 'styled-components'

import { Agencies } from './selectors/agencies.js'
import { Routes } from './selectors/routes.js'
import { Directions } from './selectors/directions.js'
import { Stops } from './selectors/stops.js'

import { useGlobals } from '../globals.js'
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
  const navigate = useNavigate()
  const matches = useMatches()
  const homeStop = matches.find(({ id }) => id === 'home-stop')
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
    staleTime: 10 * 60 * 1000
  })
  const {
    data: routeConfig,
    error: routeError,
    isLoading: isRouteLoading
  } = useQuery({
    queryKey: ['route', routeName?.id],
    queryFn: () => getRoute(agency?.id, routeName?.id),
    enabled: Boolean(agency) && Boolean(routeName),
    staleTime: 10 * 60 * 1000
  })
  const onSelectAgency = useCallback(
    (selected: Agency) => {
      dispatch({
        type: 'agency',
        value: selected
      })
      navigate('/', { replace: true })
    },
    [dispatch, navigate]
  )
  const onSelectRoute = useCallback(
    (selected: RouteName) => {
      if (agency) {
        setRouteName(selected)
        navigate('/', { replace: true })
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
        navigate('/', { replace: true })
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
    }
  }, [dispatch, vehiclesDispatch, agency, route, direction])
  const error = getFirstDataError([routesError, routeError])
  const isLoading = isRoutesLoading || isRouteLoading

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
        }
      } else {
        dispatch({ type: 'direction', value: routeConfig.directions[0] })
      }
    }
  }, [routeConfig, dispatch, vehiclesDispatch])

  useEffect(() => {
    if (homeStop && stop?.id !== homeStop.params.stop) {
      const { params } = homeStop

      if (
        agency?.id === params.agency &&
        routeName?.id === params.route &&
        direction?.id === params.direction
      ) {
        const stp = route?.stops.find(({ id }) => id === params.stop)

        if (stp) {
          dispatch({ type: 'stop', value: stp })
        }
      } else {
        if (agency?.id !== params.agency) {
          const stopAgency = agencies.find(({ id }) => id === params.agency)

          bookmark.current.route = params.route
          bookmark.current.direction = params.direction
          bookmark.current.stop = params.stop

          if (stopAgency) {
            dispatch({ type: 'agency', value: stopAgency })
          }
        } else if (routeName?.id !== params.route) {
          const stopRouteName = routes?.find(({ id }) => id === params.route)

          bookmark.current.direction = params.direction
          bookmark.current.stop = params.stop

          if (stopRouteName) {
            setRouteName(stopRouteName)
          }
        }
      }
    }
  }, [homeStop, dispatch, agencies, agency, routeName, routes, route, direction, stop])

  if (error instanceof Error) {
    return (
      <div style={{ padding: '20px' }}>
        <p>An error occured while getting agency and route information:</p>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
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
  )
})

export { BusSelector }
export type { BusSelectorProps }
