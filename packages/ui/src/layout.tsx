import L from 'leaflet'
import { useEffect, useContext } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Globals } from './globals.js'
import { getForStop } from './api/rb/predictions.js'
import { Stop } from './components/stop.js'

import type { FC, ReactNode } from 'react'
import type { Direction } from './types.js'

type Point = [number, number]

const getDirectionForStop = (id: string, directions: Direction[]) => {
  for (const direction of directions) {
    const found = direction.stops.find(stop => stop === id)

    if (found) {
      return direction.title
    }
  }

  return directions[0].title
}

export interface LayoutProps {
  children: ReactNode
}
export const Layout: FC<LayoutProps> = ({ children }) => {
  const { bounds, route, agency, dispatch } = useContext(Globals)

  useEffect(() => {
    const main = document.querySelector('main') as HTMLElement
    const map = L.map(main)
    const bnds = route?.bounds ?? bounds
    const polylines: Point[][] = []

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
        iconUrl: '../assets/png/stop.png',
        iconSize: [7, 7]
      })
      const popup = L.popup()

      route.paths.forEach(path => {
        polylines.push(path.points.map(({ lat, lon }) => [lat, lon]))
      })
      L.polyline(polylines, { color: route.color }).addTo(map)
      route.stops.forEach(stop => {
        const direction = getDirectionForStop(stop.id, route.directions)
        const marker = L.marker([stop.lat, stop.lon], { icon })

        marker.addTo(map).bindPopup(popup)
        marker.on('click', async () => {
          marker.setPopupContent(
            renderToStaticMarkup(
              <Stop isLoading stop={stop} route={route} direction={direction} />
            )
          )
          const preds = await getForStop(agency, route.id, stop.id)
          const arrivals = !preds.length
            ? []
            : /**
               * Given that the agency, route, and stop
               * are defined the first prediction's values
               * should suffice.
               */
              preds[0].values
                .slice(0, 3)
                .map(({ minutes }) => `${minutes === 0 ? 'Arriving' : `${minutes} min`}`)

          marker.setPopupContent(
            renderToStaticMarkup(
              <Stop stop={stop} route={route} direction={direction} arrivals={arrivals} />
            )
          )
        })
      })
    }

    return () => {
      map.remove()
    }
  }, [bounds, agency, route, dispatch])

  return children
}
