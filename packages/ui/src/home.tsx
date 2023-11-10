import { useReducer, useCallback, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createPortal } from 'react-dom'
import { Tabs, TabList, Tab, TabPanel } from '@busmap/components/tabs'
import { toast } from '@busmap/components/toast'
import { PB50T, PB90T } from '@busmap/components/colors'
import styled from 'styled-components'

import { useGlobals } from './globals.js'
import { usePredictions } from './contexts/predictions.js'
import { useVehiclesDispatch } from './contexts/vehicles.js'
import { useHomeStop } from './hooks/useHomeStop.js'
import { useTheme } from './modules/settings/contexts/theme.js'
import { BusSelector } from './components/busSelector.js'
import { Loading } from './components/loading.js'
import { Location } from './modules/location/components/location.js'
import { Settings } from './modules/settings/components/settings.js'
import { Favorites } from './modules/favorites/components/favorites.js'
import { Info } from './components/info.js'
import { Predictions } from './components/predictions.js'
import { Anchor } from './components/anchor.js'
import { getAll as getAllAgencies } from './api/rb/agency.js'
import { getAll as getAllVehicles } from './api/rb/vehicles.js'
import { getForStop } from './api/rb/predictions.js'

import type { ReactNode, FC } from 'react'

interface HomeState {
  locate: boolean
  collapsed: boolean
  timestamp: number
}
interface CollapsedChanged {
  type: 'collapsed'
  value: boolean
}
interface PredTimestampChanged {
  type: 'timestamp'
  value: number
}
interface LocateUser {
  type: 'locate'
  value: boolean
}
type HomeAction = CollapsedChanged | PredTimestampChanged | LocateUser
const initialState: HomeState = { collapsed: false, timestamp: 0, locate: false }
const asideNode = document.querySelector('body > aside') as HTMLElement
const reducer = (state: HomeState, action: HomeAction) => {
  switch (action.type) {
    case 'locate':
      return { ...state, locate: action.value }
    case 'collapsed':
      return { ...state, collapsed: action.value }
    case 'timestamp':
      return { ...state, timestamp: action.value }
    default:
      return state
  }
}
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
  padding: 15px 30px 30px;
  height: 100%;
  overflow-y: auto;

  #panel-locate {
    min-height: 100px;
  }
`
interface HomeProps {
  children?: ReactNode
}
const Home: FC<HomeProps> = () => {
  const { mode } = useTheme()
  const bookmark = useRef(useHomeStop())
  const vehiclesDispatch = useVehiclesDispatch()
  const { dispatch: predsDispatch } = usePredictions()
  const { agency, route, stop } = useGlobals()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { data: agencies, error: agenciesError } = useQuery({
    queryKey: ['agencies'],
    queryFn: getAllAgencies,
    staleTime: 20 * 60 * 1000
  })
  const { data: preds, isFetching: isPredsFetching } = useQuery({
    queryKey: ['preds', agency?.id, route?.id, stop?.id],
    queryFn: () => getForStop(agency?.id, route?.id, stop?.id),
    enabled: Boolean(agency) && Boolean(route) && Boolean(stop),
    refetchOnWindowFocus: true,
    refetchInterval: 10_000
  })
  const { data: vehicles } = useQuery({
    queryKey: ['vehicles', agency?.id, route?.id],
    queryFn: () => getAllVehicles(agency?.id, route?.id),
    enabled: Boolean(agency) && Boolean(route),
    refetchOnWindowFocus: true,
    refetchInterval: 10_000
  })
  const onClickAnchor = useCallback(() => {
    dispatch({ type: 'collapsed', value: !state.collapsed })
  }, [state.collapsed])
  const onSelectTab = useCallback(
    (selected: string) => {
      dispatch({ type: 'locate', value: selected === 'locate' })
    },
    [dispatch]
  )
  const messages = preds?.length ? preds[0].messages : []
  const tabsBackground = mode === 'dark' ? PB50T : undefined
  const tabsColor = mode === 'dark' ? PB90T : undefined

  useEffect(() => {
    if (state.collapsed) {
      asideNode.classList.add('collapsed')
    } else {
      asideNode.classList.remove('collapsed')
    }
  }, [state.collapsed])

  useEffect(() => {
    if (preds) {
      predsDispatch({ type: 'predictions', value: preds })
      dispatch({ type: 'timestamp', value: Date.now() })
      // Reset vehicles based on changed predicted vehicles
      vehiclesDispatch({ type: 'reset' })
    }
  }, [predsDispatch, vehiclesDispatch, preds])

  useEffect(() => {
    if (vehicles) {
      vehiclesDispatch({ type: 'set', value: vehicles })

      if (!vehicles.filter(({ predictable }) => predictable).length) {
        toast({
          type: 'info',
          message: `No ${vehicles.length ? 'predictable ' : ''}vehicles on route.`
        })
      }
    }
  }, [vehiclesDispatch, vehicles])

  if (agenciesError instanceof Error) {
    return createPortal(
      <div>
        <p>Unable to load transit agencies:</p>
        <p>{agenciesError.message}</p>
      </div>,
      document.querySelector('body > aside') as HTMLElement
    )
  }

  return createPortal(
    agencies ? (
      <>
        <Anchor onClick={onClickAnchor} collapsed={state.collapsed} />
        <Wrap>
          <Tabs
            initialTab={bookmark.current ? 'select' : 'locate'}
            position="end"
            fontSize="14px"
            gap="16px"
            borderRadius="5px 5px 0 0"
            color={tabsColor}
            background={tabsBackground}
            onSelect={onSelectTab}>
            <TabList>
              <Tab name="locate">📍</Tab>
              <Tab name="favorites">⭐</Tab>
              <Tab name="select">🚌</Tab>
              <Tab name="settings">⚙️</Tab>
              <Tab name="info">ℹ️</Tab>
            </TabList>
            <TabPanel name="locate">
              <Location active={state.locate} />
            </TabPanel>
            <TabPanel name="favorites">
              <Favorites />
            </TabPanel>
            <TabPanel name="select">
              <BusSelector agencies={agencies} />
            </TabPanel>
            <TabPanel name="settings">
              <Settings />
            </TabPanel>
            <TabPanel name="info">
              <Info />
            </TabPanel>
          </Tabs>
          <Predictions
            isFetching={isPredsFetching}
            stop={stop}
            route={route}
            preds={preds}
            messages={messages}
            timestamp={state.timestamp}
          />
        </Wrap>
      </>
    ) : (
      <Loading text="Loading agencies..." />
    ),
    asideNode
  )
}

export { Home }
export type { HomeProps, HomeState }
