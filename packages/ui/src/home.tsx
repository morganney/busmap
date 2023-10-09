import { useContext, useReducer, useCallback, useMemo, useEffect } from 'react'
import { useQuery } from 'react-query'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { Globals } from './globals.js'
import { Agencies } from './components/selectors/agencies.js'
import { Routes } from './components/selectors/routes.js'
import { Directions } from './components/selectors/directions.js'
import { Stops } from './components/selectors/stops.js'
import { Loading } from './components/loading.js'
import { Predictions } from './components/predictions.js'
import { Anchor } from './components/anchor.js'
import { getAll as getAllAgencies } from './api/rb/agency.js'
import { getAll as getAllRoutes, get as getRoute } from './api/rb/route.js'
import { getAll as getAllVehicles } from './api/rb/vehicles.js'
import { getForStop } from './api/rb/predictions.js'

import type { ReactNode, FC } from 'react'
import type { Agency, RouteName, Direction, Stop } from './types.js'

interface HomeState {
  routeName?: RouteName
  collapsed: boolean
  timestamp: number
}
interface RouteNameChanged {
  type: 'routeName'
  value?: RouteName
}
interface CollapsedChanged {
  type: 'collapsed'
  value: boolean
}
interface PredTimestampChanged {
  type: 'timestamp'
  value: number
}
type HomeAction = RouteNameChanged | CollapsedChanged | PredTimestampChanged
const initialState: HomeState = { routeName: undefined, collapsed: false, timestamp: 0 }
const asideNode = document.querySelector('body > aside') as HTMLElement
const reducer = (state: HomeState, action: HomeAction) => {
  switch (action.type) {
    case 'routeName':
      return { ...state, routeName: action.value }
    case 'collapsed':
      return { ...state, collapsed: action.value }
    case 'timestamp':
      return { ...state, timestamp: action.value }
    default:
      return state
  }
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
  gap: 15px;
`
interface HomeProps {
  children?: ReactNode
}
const Home: FC<HomeProps> = () => {
  const {
    dispatch: update,
    locationSettled,
    agency,
    route,
    direction,
    vehicles,
    stop
  } = useContext(Globals)
  const [state, dispatch] = useReducer(reducer, initialState)
  const stops = useMemo(() => {
    if (direction && route) {
      return route.stops.filter(({ id }) => direction.stops.includes(id))
    }

    if (route) {
      return route.stops
    }

    return []
  }, [route, direction])
  /**
   * Resets the vehicles state so that the plotted
   * vehicle markers can be restyled/redrawn as needed.
   */
  const resetVehicles = useCallback(() => {
    update({
      type: 'vehicles',
      value: Array.isArray(vehicles) ? [...vehicles] : undefined
    })
  }, [vehicles, update])
  const {
    data: agencies,
    error: agenciesError,
    isLoading: isAgenciesLoading
  } = useQuery('agencies', getAllAgencies)
  const {
    data: routes,
    error: routesError,
    isLoading: isRoutesLoading
  } = useQuery(['routes', agency?.id], () => getAllRoutes(agency?.id), {
    enabled: Boolean(agency),
    onSuccess(data) {
      // When agency changes, use the first route as the default
      dispatch({ type: 'routeName', value: data[0] })
    }
  })
  const { error: routeError, isLoading: isRouteLoading } = useQuery(
    ['route', state.routeName?.id],
    () => getRoute(agency?.id, state.routeName?.id),
    {
      enabled: Boolean(agency) && Boolean(state.routeName),
      onSuccess(data) {
        update({ type: 'route', value: data })
        update({ type: 'direction', value: data.directions[0] })
      }
    }
  )
  const { data: preds, isFetching: isPredsFetching } = useQuery(
    ['preds', agency?.id, route?.id, stop?.id],
    () => getForStop(agency?.id, route?.id, stop?.id),
    {
      enabled: Boolean(agency) && Boolean(route) && Boolean(stop),
      refetchOnWindowFocus: true,
      refetchInterval: 6_000,
      onSuccess(data) {
        update({ type: 'predictions', value: data })
        dispatch({ type: 'timestamp', value: Date.now() })
        resetVehicles()
      }
    }
  )
  const onClickAnchor = useCallback(() => {
    dispatch({ type: 'collapsed', value: !state.collapsed })
  }, [state.collapsed])
  const onSelectAgency = useCallback(
    (selected: Agency) => {
      update({
        type: 'agency',
        value: selected
      })
    },
    [update]
  )
  const onSelectRoute = useCallback((selected: RouteName) => {
    dispatch({
      type: 'routeName',
      value: selected
    })
  }, [])
  const onSelectDirection = useCallback(
    (selected: Direction) => {
      update({
        type: 'direction',
        value: selected
      })
      resetVehicles()
    },
    [update, resetVehicles]
  )
  const onSelectStop = useCallback(
    (selected: Stop) => {
      update({
        type: 'stop',
        value: selected
      })
    },
    [update]
  )
  const onClearStop = useCallback(() => {
    update({ type: 'stop', value: undefined })
    resetVehicles()
  }, [update, resetVehicles])
  const error = getFirstDataError([agenciesError, routesError, routeError])
  const isLoading = isAgenciesLoading || isRoutesLoading || isRouteLoading

  useQuery(
    ['vehicles', agency?.id, route?.id],
    () => getAllVehicles(agency?.id, route?.id),
    {
      enabled: Boolean(agency) && Boolean(route),
      refetchOnWindowFocus: false,
      refetchInterval: 5_000,
      onSuccess(data) {
        update({ type: 'vehicles', value: data })
      }
    }
  )

  useEffect(() => {
    if (state.collapsed) {
      asideNode.classList.add('collapsed')
    } else {
      asideNode.classList.remove('collapsed')
    }
  }, [state.collapsed])

  if (error instanceof Error) {
    return createPortal(
      <div>
        <p>An unexpected error occured:</p>
        <p>{error.message}</p>
      </div>,
      document.querySelector('body > aside') as HTMLElement
    )
  }

  return createPortal(
    locationSettled && agencies ? (
      <>
        <Anchor onClick={onClickAnchor} collapsed={state.collapsed} />
        <Form
          onSubmit={evt => {
            evt.preventDefault()
          }}
        >
          <Agencies
            agencies={agencies}
            onSelect={onSelectAgency}
            isDisabled={isLoading}
          />
          <Routes
            routes={routes}
            selected={state.routeName}
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
        <Predictions
          isFetching={isPredsFetching}
          stop={stop}
          preds={preds}
          timestamp={state.timestamp}
        />
      </>
    ) : (
      <Loading />
    ),
    asideNode
  )
}

export { Home }
export type { HomeProps, HomeState }
