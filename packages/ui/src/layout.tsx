import { useContext } from 'react'
import { createPortal } from 'react-dom'

import { Globals } from './globals.js'
import { Selection } from './components/selection.js'
import { useInitMap } from './hooks/useInitMap.js'
import { useLocateUser } from './hooks/useLocateUser.js'
import { useRouteLayer } from './hooks/useRouteLayer.js'
import { useZoomSelectedStop } from './hooks/useZoomSelectedStop.js'
import { useMarkSelectedStop } from './hooks/useMarkSelectedStop.js'
import { useVehiclesLayer } from './hooks/useVehiclesLayer.js'

import type { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { route, agency, selected, locationSettled, stop, vehicles, dispatch } =
    useContext(Globals)
  const { map, selectionNode, popup, routeLayer, vehiclesLayer } = useInitMap(dispatch)

  useLocateUser({ map, locationSettled, dispatch })
  useRouteLayer({ routeLayer, map, agency, route, popup, dispatch })
  useVehiclesLayer({ vehiclesLayer, vehicles, route })
  useZoomSelectedStop({ stop, map })
  useMarkSelectedStop({ stop, map })

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
