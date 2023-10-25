import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster, toast } from '@busmap/components/toast'

import { STORAGE_KEYS } from './common.js'
import { Layout } from './layout.js'
import { ErrorBoundary } from './components/errorBoundary.js'
import { useMap } from './contexts/map.js'
import { useTheme, isAMode } from './contexts/settings/theme.js'
import { useVehicleSettings, isASpeedUnit } from './contexts/settings/vehicle.js'
import {
  usePredictionsSettings,
  isAPredictionFormat
} from './contexts/settings/predictions.js'

// TODO: Should fetch agencies here and set it in context
const Root = () => {
  const map = useMap()
  const { mode, dispatch } = useTheme()
  const { dispatch: vehicleDispatch } = useVehicleSettings()
  const { dispatch: predictionsDispatch } = usePredictionsSettings()
  const location = useLocation()

  useEffect(() => {
    toast({ open: false })
  }, [location])

  useEffect(() => {
    const moveListener = () => {
      document.body.classList.add('busmap-mapmove')
    }
    const moveEndListener = () => {
      setTimeout(() => {
        document.body.classList.remove('busmap-mapmove')
      }, 250)
    }

    if (map) {
      map.on('move', moveListener)
      map.on('moveend', moveEndListener)
    }

    return () => {
      if (map) {
        map.off('move', moveListener)
        map.off('moveend', moveEndListener)
      }
    }
  }, [map])

  useEffect(() => {
    document.body.classList.remove('busmap-light', 'busmap-dark')
    document.body.classList.add(`busmap-${mode}`)
  }, [mode])

  useEffect(() => {
    // Check OS/Browser level settings
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    // Check user-applied setting from local storage
    const themeMode = localStorage.getItem(STORAGE_KEYS.themeMode)
    const onChangePrefersColorScheme = (evt: MediaQueryListEvent) => {
      dispatch({
        type: 'mode',
        value: evt.matches ? 'dark' : 'light'
      })
      // Clear any previously user-applied setting if changing OS/Browser level setting
      localStorage.removeItem(STORAGE_KEYS.themeMode)
    }

    mql.addEventListener('change', onChangePrefersColorScheme)

    // Set user-applied theme from local storage
    if (isAMode(themeMode)) {
      dispatch({ type: 'mode', value: themeMode })
    }

    return () => {
      mql.removeEventListener('change', onChangePrefersColorScheme)
    }
  }, [dispatch])

  useEffect(() => {
    const speedUnit = localStorage.getItem(STORAGE_KEYS.vehicleSpeedUnit)
    const colorPredicted = localStorage.getItem(STORAGE_KEYS.vehicleColorPredicted)

    if (isASpeedUnit(speedUnit)) {
      vehicleDispatch({ type: 'speedUnit', value: speedUnit })
    }

    if (colorPredicted && colorPredicted === 'false') {
      vehicleDispatch({ type: 'markPredictedVehicles', value: false })
    }
  }, [vehicleDispatch])

  useEffect(() => {
    const format = localStorage.getItem(STORAGE_KEYS.predictionsFormat)

    if (isAPredictionFormat(format)) {
      predictionsDispatch({ type: 'format', value: format })
    }
  }, [predictionsDispatch])

  return (
    <ErrorBoundary>
      <Toaster anchor="top left" />
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  )
}

export { Root }
