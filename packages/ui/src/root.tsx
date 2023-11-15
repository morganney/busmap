import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster, toast } from '@busmap/components/toast'

import { Layout } from './layout.js'
import { ErrorBoundary } from './components/error/boundary.js'
import { useMap } from './contexts/map.js'
import { useTheme } from './modules/settings/contexts/theme.js'

// TODO: Should fetch agencies here and set it in context
const Root = () => {
  const location = useLocation()
  const map = useMap()
  const { mode } = useTheme()

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

  useLayoutEffect(() => {
    document.body.classList.remove('busmap-light', 'busmap-dark')
    document.body.classList.add(`busmap-${mode}`)
  }, [mode])

  return (
    <ErrorBoundary>
      <Toaster anchor="bottom left" />
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  )
}

export { Root }
