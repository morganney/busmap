import { useReducer, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabList, Tab, TabPanel } from '@busmap/components/tabs'
import { toast } from '@busmap/components/toast'
import { PB50T, PB90T, PB80T, PB10T } from '@busmap/components/colors'
import styled from 'styled-components'

import { useGlobals } from './globals.js'
import { usePredictions } from './contexts/predictions.js'
import { useVehiclesDispatch } from './contexts/vehicles.js'
import { useTheme } from './modules/settings/contexts/theme.js'
import { BusSelector } from './components/busSelector.js'
import { Loading } from './components/loading.js'
import { ErrorAgencies } from './components/error/agencies.js'
import { Location } from './modules/location/components/location.js'
import { Settings } from './modules/settings/components/settings.js'
import { Favorites } from './modules/favorites/components/favorites.js'
import { Info } from './components/info.js'
import { Predictions } from './components/predictions.js'
import { getAll as getAllAgencies } from './api/rb/agency.js'
import { getAll as getAllVehicles } from './api/rb/vehicles.js'
import { getForStop } from './api/rb/predictions.js'

import type { FC } from 'react'
import type { Mode } from './modules/settings/types.js'

interface HomeState {
  timestamp: number
}
interface PredTimestampChanged {
  type: 'timestamp'
  value: number
}
type HomeAction = PredTimestampChanged

const initialState: HomeState = { timestamp: 0 }
const reducer = (state: HomeState, action: HomeAction) => {
  switch (action.type) {
    case 'timestamp':
      return { ...state, timestamp: action.value }
    default:
      return state
  }
}
const Aside = styled.aside<{ mode: Mode; collapsed: boolean }>`
  position: fixed;
  top: 0;
  left: 49px;
  z-index: 999;
  height: 100%;
  width: calc(100% - 49px);
  max-width: 385px;
  background: ${({ mode }) => (mode === 'light' ? '#ffffffcc' : `${PB10T}cc`)};
  border-right: 1px solid ${({ mode }) => (mode === 'light' ? PB80T : PB50T)};
  transform: ${({ collapsed }) => (!collapsed ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.25s ease;

  @media (width >= 431px) and (height >= 536px) {
    left: 79px;
    width: calc(33% + 79px);
    min-width: 325px;
  }
`
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
  padding: 15px 30px 30px;
  height: 100%;
  overflow-y: auto;

  div[aria-label='Navigation Tabs'] {
    display: none;
  }

  #panel-locate {
    min-height: 100px;
  }
`
const Home: FC = () => {
  const { mode } = useTheme()
  const vehiclesDispatch = useVehiclesDispatch()
  const { dispatch: predsDispatch } = usePredictions()
  const { agency, route, stop, collapsed, page } = useGlobals()
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
  const messages = preds?.length ? preds[0].messages : []
  const tabsBackground = mode === 'dark' ? PB50T : undefined
  const tabsColor = mode === 'dark' ? PB90T : undefined

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

  return (
    <Aside mode={mode} collapsed={collapsed}>
      {agenciesError instanceof Error ? (
        <ErrorAgencies error={agenciesError} />
      ) : agencies ? (
        <Wrap>
          <Tabs
            label="Navigation Tabs"
            initialTab={page}
            position="end"
            fontSize="14px"
            gap="16px"
            borderRadius="5px 5px 0 0"
            color={tabsColor}
            background={tabsBackground}>
            <TabList>
              <Tab name="locate">📍</Tab>
              <Tab name="select">🚌</Tab>
              <Tab name="favorites">⭐</Tab>
              <Tab name="settings">⚙️</Tab>
              <Tab name="info">ℹ️</Tab>
            </TabList>
            <TabPanel name="locate">
              <Location active={page === 'locate'} />
            </TabPanel>
            <TabPanel name="select">
              <BusSelector agencies={agencies} />
            </TabPanel>
            <TabPanel name="favorites">
              <Favorites />
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
            locateActive={page === 'locate'}
            messages={messages}
            timestamp={state.timestamp}
          />
        </Wrap>
      ) : (
        <Loading text="Loading agencies..." />
      )}
    </Aside>
  )
}

export { Home }
export type { HomeState }
