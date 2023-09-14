import L from 'leaflet'
import { useEffect, useContext } from 'react'
import { Root, createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import { Globals } from './globals.js'
import { Stop } from './components/stop.js'

import type { FC, ReactNode } from 'react'
import type { Direction } from './types.js'

type Point = [number, number]
interface LayoutProps {
  children: ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: true
    }
  }
})
const getDirectionForStop = (id: string, directions: Direction[]) => {
  for (const direction of directions) {
    const found = direction.stops.find(stop => stop === id)

    if (found) {
      return direction.title
    }
  }

  return directions[0].title
}
const Layout: FC<LayoutProps> = ({ children }) => {
  const { bounds, route, agency, dispatch } = useContext(Globals)

  useEffect(() => {
    const main = document.querySelector('main') as HTMLElement
    const map = L.map(main)
    const bnds = route?.bounds ?? bounds
    const polylines: Point[][] = []
    let popupRoot: null | Root = null

    map.fitBounds(
      L.latLngBounds(
        L.latLng(bnds.sw.lat, bnds.sw.lon),
        L.latLng(bnds.ne.lat, bnds.ne.lon)
      )
    )
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    if (route) {
      const icon = L.icon({
        iconUrl: '../assets/svg/circled.svg',
        iconSize: [7, 7]
      })
      const popup = L.popup()

      popup.on('remove', () => {
        popupRoot?.unmount()
        popupRoot = null
      })
      route.paths.forEach(path => {
        polylines.push(path.points.map(({ lat, lon }) => [lat, lon]))
      })
      L.polyline(polylines, { color: route.color }).addTo(map)
      route.stops.forEach(stop => {
        const direction = getDirectionForStop(stop.id, route.directions)
        const marker = L.marker([stop.lat, stop.lon], { icon })

        marker.addTo(map).bindPopup(popup)
        marker.on('click', async () => {
          const popupEl = popup.getElement()

          if (popupEl && agency) {
            if (!popupRoot) {
              const rootNode = popupEl.querySelector(
                'div.leaflet-popup-content'
              ) as Element

              popupRoot = createRoot(rootNode)
            }

            flushSync(() => {
              popupRoot?.render(
                <QueryClientProvider client={queryClient}>
                  <Stop agency={agency} stop={stop} route={route} direction={direction} />
                </QueryClientProvider>
              )
            })
            popup.update()
          }
        })
      })
    }

    return () => {
      map.remove()
    }
  }, [bounds, agency, route, dispatch])

  return children
}

export { Layout }
export type { LayoutProps }
