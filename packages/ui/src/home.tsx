import { useReducer, useCallback, useEffect } from 'react'
import { useQuery } from 'react-query'
import { createPortal } from 'react-dom'
import { Tabs, TabList, Tab, TabPanel } from '@busmap/components/tabs'
import { toast } from '@busmap/components/toast'
import { PB50T, PB90T } from '@busmap/components/colors'
import styled from 'styled-components'

import { useGlobals } from './globals.js'
import { useVehiclesDispatch } from './contexts/vehicles.js'
import { useTheme } from './modules/settings/contexts/theme.js'
import { BusSelector } from './components/busSelector.js'
import { Loading } from './components/loading.js'
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
type HomeAction = CollapsedChanged | PredTimestampChanged
const initialState: HomeState = { collapsed: false, timestamp: 0 }
const asideNode = document.querySelector('body > aside') as HTMLElement
const reducer = (state: HomeState, action: HomeAction) => {
  switch (action.type) {
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
`
interface HomeProps {
  children?: ReactNode
}
const Home: FC<HomeProps> = () => {
  const { mode } = useTheme()
  const vehiclesDispatch = useVehiclesDispatch()
  const { dispatch: update, locationSettled, agency, route, stop } = useGlobals()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { data: agencies, error: agenciesError } = useQuery('agencies', getAllAgencies)
  const { data: preds, isFetching: isPredsFetching } = useQuery(
    ['preds', agency?.id, route?.id, stop?.id],
    () => getForStop(agency?.id, route?.id, stop?.id),
    {
      enabled: Boolean(agency) && Boolean(route) && Boolean(stop),
      refetchOnWindowFocus: true,
      refetchInterval: 10_000,
      onSuccess(data) {
        update({ type: 'predictions', value: data })
        dispatch({ type: 'timestamp', value: Date.now() })
        // Reset vehicles based on changed predicted vehicles
        vehiclesDispatch({ type: 'reset' })
      }
    }
  )
  const onClickAnchor = useCallback(() => {
    dispatch({ type: 'collapsed', value: !state.collapsed })
  }, [state.collapsed])
  const messages = preds?.length ? preds[0].messages : []
  const tabsBackground = mode === 'dark' ? PB50T : undefined
  const tabsColor = mode === 'dark' ? PB90T : undefined

  useQuery(
    ['vehicles', agency?.id, route?.id],
    () => getAllVehicles(agency?.id, route?.id),
    {
      enabled: Boolean(agency) && Boolean(route),
      refetchOnWindowFocus: false,
      refetchInterval: 5_000,
      onSuccess(data) {
        vehiclesDispatch({ type: 'set', value: data })

        if (!data.filter(({ predictable }) => predictable).length) {
          toast({
            type: 'info',
            message: `No ${data.length ? 'predictable ' : ''}vehicles on route.`,
            // Keep open until the user closes
            timeout: undefined
          })
        }
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
    locationSettled && agencies ? (
      <>
        <Anchor onClick={onClickAnchor} collapsed={state.collapsed} />
        <Wrap>
          <Tabs
            initialTab="select"
            position="end"
            fontSize="14px"
            gap="16px"
            borderRadius="5px 5px 0 0"
            color={tabsColor}
            background={tabsBackground}>
            <TabList>
              <Tab name="select" label="🚌" />
              <Tab name="info" label="ℹ️" />
              <Tab name="settings" label="⚙️" />
              <Tab name="favorites" label="⭐" />
              <Tab name="profile" label="👤" />
              <Tab name="login" label="Sign In" />
            </TabList>
            <TabPanel name="select">
              <BusSelector agencies={agencies} />
            </TabPanel>
            <TabPanel name="info">
              <Info />
            </TabPanel>
            <TabPanel name="settings">
              <Settings />
            </TabPanel>
            <TabPanel name="favorites">
              <Favorites />
            </TabPanel>
            <TabPanel name="profile">
              <p>Profile</p>
            </TabPanel>
            <TabPanel name="login">
              <form>
                <p>Sign In</p>
              </form>
            </TabPanel>
          </Tabs>
          <Predictions
            isFetching={isPredsFetching}
            stop={stop}
            preds={preds}
            messages={messages}
            timestamp={state.timestamp}
          />
        </Wrap>
      </>
    ) : locationSettled ? (
      <Loading text="Loading agencies..." />
    ) : (
      <Loading text="Attempting to locate your position..." />
    ),
    asideNode
  )
}

export { Home }
export type { HomeProps, HomeState }
