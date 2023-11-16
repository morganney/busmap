import { useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { toast } from '@busmap/components/toast'

import { useGlobals } from './globals.js'
import { Selection } from './components/selection.js'
import { useInitMap } from './hooks/useInitMap.js'
import { useRouteLayer } from './hooks/useRouteLayer.js'
import { useZoomSelectedStop } from './hooks/useZoomSelectedStop.js'
import { useZoomPredForVehicle } from './hooks/useZoomPredForVehicle.js'
import { useVehiclesLayer } from './hooks/useVehiclesLayer.js'
import { useTheme } from './modules/settings/contexts/theme.js'

import type { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const { selected } = useGlobals()
  const { mode } = useTheme()
  const { map, selectionNode, popup, routeLayer, vehiclesLayer } = useInitMap()

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

  useRouteLayer({ routeLayer, map, popup })
  useVehiclesLayer({ vehiclesLayer })
  useZoomSelectedStop({ map })
  useZoomPredForVehicle({ map })

  if (selected) {
    return (
      <>
        {children}
        {createPortal(
          <Selection
            agency={selected.agency}
            stop={selected.stop}
            route={selected.route}
            direction={selected.direction}
            popup={popup}
          />,
          selectionNode
        )}
      </>
    )
  }

  return children
}

export { Layout }
export type { LayoutProps }
