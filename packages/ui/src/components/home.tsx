import { useReducer, useEffect, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabList, Tab, TabPanel } from '@busmap/components/tabs'
import { toast } from '@busmap/components/toast'
import { PB50T, PB90T, PB10T } from '@busmap/components/colors'
import styled from 'styled-components'

import { SignIn } from './signIn.js'
import { Profile } from './profile.js'
import { BusmapPage } from './busmap.js'
import { BusSelector } from './busSelector.js'
import { Loading } from './loading.js'
import { Predictions } from './predictions.js'
import { PredictionsOverlay } from './predictionsOverlay.js'
import { ErrorAgencies } from './error/agencies.js'
import { EmptyMap } from './emptyMap.js'

import { useGlobals } from '../globals.js'
import { usePredictions } from '../contexts/predictions.js'
import { useVehiclesDispatch } from '../contexts/vehicles.js'
import { useTheme } from '../modules/settings/contexts/theme.js'
import { Location } from '../modules/location/components/location.js'
import { Settings } from '../modules/settings/components/settings.js'
import { Favorites } from '../modules/favorites/components/favorites.js'
import { getAll as getAllAgencies } from '../api/rb/agency.js'
import { getAll as getAllVehicles } from '../api/rb/vehicles.js'
import { getForStop } from '../api/rb/predictions.js'
import { useHomeStop } from '../hooks/useHomeStop.js'

import type { FC } from 'react'
import type { Mode } from '@busmap/common/types/settings'

interface HomeState {
  timestamp: number
  touchStartX: number
}
interface PredTimestampChanged {
  type: 'timestamp'
  value: number
}
interface TouchStartChanged {
  type: 'touchStart'
  value: number
}
type HomeAction = PredTimestampChanged | TouchStartChanged

const initialState: HomeState = { timestamp: 0, touchStartX: 0 }
const reducer = (state: HomeState, action: HomeAction) => {
  switch (action.type) {
    case 'timestamp':
      return { ...state, timestamp: action.value }
    case 'touchStart':
      return { ...state, touchStartX: action.value }
    default:
      return state
  }
}
const Aside = styled.aside<{ mode: Mode; collapsed: boolean }>`
  position: fixed;
  top: 0;
  left: 48px;
  z-index: 9999;
  height: 100%;
  width: calc(100% - 48px);
  max-width: 385px;
  background: ${({ mode }) => (mode === 'light' ? '#ffffffcc' : `${PB10T}cc`)};
  transform: ${({ collapsed }) =>
    !collapsed ? 'translateX(0)' : 'translateX(calc(-100% - 48px))'};
  transition: transform 0.25s ease;

  @media (width >= 431px) and (height >= 536px) {
    left: 78px;
    width: calc(33% + 78px);
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
  const ref = useRef<HTMLElement>(null)
  const homeStop = useHomeStop()
  const { mode } = useTheme()
  const vehiclesDispatch = useVehiclesDispatch()
  const { dispatch: predsDispatch } = usePredictions()
  const { agency, route, stop, collapsed, page, dispatch: globalDispatch } = useGlobals()
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
  const handleTouchStart = useCallback((evt: TouchEvent) => {
    const touches = Array.from(evt.changedTouches)

    if (Array.isArray(touches) && touches.length > 0) {
      dispatch({ type: 'touchStart', value: touches[0].pageX })
    }
  }, [])
  const handleTouchEnd = useCallback(
    (evt: TouchEvent) => {
      const touches = Array.from(evt.changedTouches)

      if (Array.isArray(touches) && touches.length > 0) {
        const touchEndX = touches[0].pageX

        // Allow a small fudge factor
        if (Math.abs(touchEndX - state.touchStartX) > 100) {
          // Close
          if (touchEndX < state.touchStartX) {
            globalDispatch({ type: 'collapsed', value: true })
          }

          // Open
          if (touchEndX > state.touchStartX) {
            globalDispatch({ type: 'collapsed', value: false })
          }
        }
      }
    },
    [state.touchStartX, globalDispatch]
  )
  const messages = preds?.length ? preds[0].messages : []
  const tabsBackground = mode === 'dark' ? PB50T : undefined
  const tabsColor = mode === 'dark' ? PB90T : undefined

  useEffect(() => {
    const refCurrent = ref.current

    if (refCurrent) {
      refCurrent.addEventListener('touchstart', handleTouchStart, { passive: true })
      refCurrent.addEventListener('touchend', handleTouchEnd, { passive: true })
    }

    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener('touchstart', handleTouchStart)
        refCurrent.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [handleTouchStart, handleTouchEnd])

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
    <>
      <Aside ref={ref} mode={mode} collapsed={collapsed} data-testid="flyout">
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
                <Tab name="signin">Sign In</Tab>
                <Tab name="locate">📍</Tab>
                <Tab name="select">🚌</Tab>
                <Tab name="favorites">⭐</Tab>
                <Tab name="settings">⚙️</Tab>
                <Tab name="profile">👤</Tab>
                <Tab name="busmap">BM</Tab>
              </TabList>
              <TabPanel name="busmap">
                <BusmapPage />
              </TabPanel>
              <TabPanel name="signin">
                <SignIn />
              </TabPanel>
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
              <TabPanel name="profile">
                <Profile />
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
          <Loading text="Loading agencies" />
        )}
      </Aside>
      <PredictionsOverlay preds={preds} stop={stop} />
      {!homeStop && <EmptyMap />}
    </>
  )
}

export default Home
export type { HomeState }
