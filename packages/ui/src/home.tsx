import { useContext, useReducer, useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { Globals } from './globals.js'
import { Agencies } from './components/selectors/agencies.js'
import { Routes } from './components/selectors/routes.js'
import { Directions } from './components/selectors/directions.js'
import { Stops } from './components/selectors/stops.js'
import { Loading } from './components/loading.js'
import { getAll as getAllAgencies } from './api/rb/agency.js'
import { getAll as getAllRoutes, get as getRoute } from './api/rb/route.js'

import type { ReactNode, FC } from 'react'
import type { Agency, RouteName, Direction, Stop } from './types.js'

interface HomeState {
  routeName?: RouteName
}
interface RouteNameChanged {
  type: 'routeName'
  value?: RouteName
}
type HomeAction = RouteNameChanged
const initialState: HomeState = { routeName: undefined }
const reducer = (state: HomeState, action: HomeAction) => {
  switch (action.type) {
    case 'routeName':
      return { ...state, routeName: action.value }
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
  gap: 17px;
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
      }
    }
  )
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
    },
    [update]
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
  const error = getFirstDataError([agenciesError, routesError, routeError])
  const isLoading = isAgenciesLoading || isRoutesLoading || isRouteLoading

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
      <Form
        onSubmit={evt => {
          evt.preventDefault()
        }}
      >
        <Agencies agencies={agencies} onSelect={onSelectAgency} isDisabled={isLoading} />
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
          onSelect={onSelectStop}
          isDisabled={isLoading || !agency || !route || !direction}
        />
      </Form>
    ) : (
      <Loading />
    ),
    document.querySelector('body > aside') as HTMLElement
  )
}

export { Home }
export type { HomeProps, HomeState }
