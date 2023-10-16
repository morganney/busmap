import { useState, useCallback, useMemo, memo, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, generatePath } from 'react-router-dom'
import styled from 'styled-components'

import { Agencies } from './selectors/agencies.js'
import { Routes } from './selectors/routes.js'
import { Directions } from './selectors/directions.js'
import { Stops } from './selectors/stops.js'

import { useGlobals } from '../globals.js'
import { useVehiclesDispatch } from '../contexts/vehicles.js'
import { useBusSelectorBookmark } from '../hooks/useBusSelectorBookmarks.js'
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
  const bookmark = useBusSelectorBookmark()
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
  } = useQuery(['routes', agency?.id], () => getAllRoutes(agency?.id), {
    enabled: Boolean(agency),
    onSuccess(data) {
      if (bookmark.route) {
        const route = data.find(({ id }) => id === bookmark.route)

        if (route) {
          setRouteName(route)
        }

        delete bookmark.route
      } else {
        // When agency changes, use the first route as the default
        setRouteName(data[0])
      }
    }
  })
  const { error: routeError, isLoading: isRouteLoading } = useQuery(
    ['route', routeName?.id],
    () => getRoute(agency?.id, routeName?.id),
    {
      enabled: Boolean(agency) && Boolean(routeName),
      onSuccess(data) {
        dispatch({ type: 'route', value: data })

        if (bookmark.direction) {
          const direction = data.directions.find(({ id }) => id === bookmark.direction)

          if (direction) {
            dispatch({ type: 'direction', value: direction })
          }

          delete bookmark.direction

          if (bookmark.stop) {
            const stop = data.stops.find(({ id }) => id === bookmark.stop)

            if (stop) {
              dispatch({ type: 'stop', value: stop })
            }

            delete bookmark.stop
          }
        } else {
          dispatch({ type: 'direction', value: data.directions[0] })
        }
      }
    }
  )
  const onSelectAgency = useCallback(
    (selected: Agency) => {
      dispatch({
        type: 'agency',
        value: selected
      })

      navigate(generatePath('/bus/:agency', { agency: selected.id }), { replace: true })
    },
    [dispatch, navigate]
  )
  const onSelectRoute = useCallback(
    (selected: RouteName) => {
      if (agency) {
        setRouteName(selected)
        navigate(
          generatePath('/bus/:agency/:route', { agency: agency.id, route: selected.id }),
          { replace: true }
        )
      }
    },
    [navigate, agency]
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
          generatePath('/bus/:agency/:route/:direction', {
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
          generatePath('/bus/:agency/:route/:direction/:stop', {
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
        generatePath('/bus/:agency/:route/:direction', {
          agency: agency.id,
          route: route.id,
          direction: direction.id
        }),
        { replace: true }
      )
    }
  }, [dispatch, vehiclesDispatch, navigate, agency, route, direction])
  const error = getFirstDataError([routesError, routeError])
  const isLoading = isRoutesLoading || isRouteLoading

  useEffect(() => {
    if (bookmark.agency) {
      const agency = agencies.find(({ id }) => id === bookmark.agency)

      if (agency) {
        dispatch({ type: 'agency', value: agency })
      }

      delete bookmark.agency
    }
  }, [agencies, bookmark.agency, dispatch])

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