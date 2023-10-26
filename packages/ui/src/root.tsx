import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster, toast } from '@busmap/components/toast'

import { Layout } from './layout.js'
import { ErrorBoundary } from './components/errorBoundary.js'
import { useMap } from './contexts/map.js'
import { useStorage, useStorageDispatch } from './contexts/storage.js'
import { useTheme, isAMode } from './contexts/settings/theme.js'
import { useVehicleSettings, isASpeedUnit } from './contexts/settings/vehicle.js'
import {
  usePredictionsSettings,
  isAPredictionFormat
} from './contexts/settings/predictions.js'

// TODO: Should fetch agencies here and set it in context
const Root = () => {
  const location = useLocation()
  const map = useMap()
  const storage = useStorage()
  const storageDispatch = useStorageDispatch()
  const { mode, dispatch: modeDispatch } = useTheme()
  const { dispatch: vehicleDispatch } = useVehicleSettings()
  const { dispatch: predictionsDispatch } = usePredictionsSettings()

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
    const themeMode = storage.themeMode
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChangePrefersColorScheme = (evt: MediaQueryListEvent) => {
      modeDispatch({
        type: 'mode',
        value: evt.matches ? 'dark' : 'light'
      })
      // Clear any previously user-applied setting if changing OS/Browser level setting
      storageDispatch({ type: 'themeMode', value: undefined })
    }

    mql.addEventListener('change', onChangePrefersColorScheme)

    // Set user-applied theme from local storage
    if (isAMode(themeMode)) {
      modeDispatch({ type: 'mode', value: themeMode })
    }

    return () => {
      mql.removeEventListener('change', onChangePrefersColorScheme)
    }
  }, [storage.themeMode, modeDispatch, storageDispatch])

  useEffect(() => {
    const speedUnit = storage.vehicleSpeedUnit
    const colorPredicted = storage.vehicleColorPredicted

    if (isASpeedUnit(speedUnit)) {
      vehicleDispatch({ type: 'speedUnit', value: speedUnit })
    }

    if (colorPredicted === false) {
      vehicleDispatch({ type: 'markPredictedVehicles', value: false })
    }
  }, [storage.vehicleSpeedUnit, storage.vehicleColorPredicted, vehicleDispatch])

  useEffect(() => {
    const format = storage.predsFormat

    if (isAPredictionFormat(format)) {
      predictionsDispatch({ type: 'format', value: format })
    }
  }, [storage.predsFormat, predictionsDispatch])

  return (
    <ErrorBoundary>
      <Toaster anchor="bottom right" />
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  )
}

export { Root }
