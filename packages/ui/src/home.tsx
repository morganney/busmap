import { useContext, useReducer, useCallback } from 'react'
import { useQuery } from 'react-query'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { Globals } from './globals.js'
import { Agencies } from './components/selectors/agencies.js'
import { Routes } from './components/selectors/routes.js'
import { getAll as getAllAgencies } from './api/rb/agency.js'
import { getAll as getAllRoutes, get as getRoute } from './api/rb/route.js'

import type { ReactNode, FC } from 'react'
import type { AnItem } from '@busmap/components'

interface HomeState {
  agency?: string
  route?: string
}
interface HomeAction {
  type: 'agency' | 'route'
  value: string
}
interface HomeProps {
  children?: ReactNode
}

const initialState: HomeState = { agency: undefined, route: undefined }
const reducer = (state: HomeState, action: HomeAction) => {
  switch (action.type) {
    case 'agency':
      return { ...state, agency: action.value }
    case 'route':
      return { ...state, route: action.value }
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
const Home: FC<HomeProps> = () => {
  const { dispatch: update } = useContext(Globals)
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    data: agencies,
    error: agenciesError,
    isLoading: isAgenciesLoading
  } = useQuery('agencies', getAllAgencies)
  const {
    data: routes,
    error: routesError,
    isLoading: isRoutesLoading
  } = useQuery(['routes', state.agency], () => getAllRoutes(state.agency), {
    enabled: Boolean(state.agency)
  })
  const { error: routeError, isLoading: isRouteLoading } = useQuery(
    ['route', state.route],
    () => getRoute(state.agency, state.route),
    {
      enabled: Boolean(state.route),
      onSuccess(data) {
        update({ type: 'bounds', value: data.bounds })
        update({ type: 'route', value: data })
      }
    }
  )
  const onSelectAgency = useCallback((selected: AnItem) => {
    dispatch({
      type: 'agency',
      value: typeof selected === 'string' ? selected : selected.value
    })
  }, [])
  const onSelectRoute = useCallback((selected: AnItem) => {
    dispatch({
      type: 'route',
      value: typeof selected === 'string' ? selected : selected.value
    })
  }, [])
  const onClearAgency = useCallback(() => {
    dispatch({
      type: 'agency',
      value: ''
    })
    dispatch({
      type: 'route',
      value: ''
    })
  }, [])
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

  if (agencies) {
    return createPortal(
      <Form
        onSubmit={evt => {
          evt.preventDefault()
        }}
      >
        <Agencies
          agencies={agencies}
          onSelect={onSelectAgency}
          isDisabled={isLoading}
          onClear={onClearAgency}
        />
        <Routes
          routes={routes}
          onSelect={onSelectRoute}
          isDisabled={isLoading || !routes}
        />
      </Form>,
      document.querySelector('body > aside') as HTMLElement
    )
  }

  return <>Loading...</>
}

export { Home }
export type { HomeProps, HomeState }
