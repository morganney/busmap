import L from 'leaflet'
import { useEffect, useContext, useRef } from 'react'
import { createPortal } from 'react-dom'

import { Globals } from './globals.js'
import { Stop } from './components/stop.js'

import type { FC, ReactNode } from 'react'
import type { Direction } from './types.js'

type Point = [number, number]
interface LayoutProps {
  children: ReactNode
}

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
  const { bounds, route, agency, selected, dispatch } = useContext(Globals)
  const content = useRef(document.createElement('div'))
  const popup = useRef(L.popup())

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
        iconUrl: '../assets/svg/circled.svg',
        iconSize: [7, 7]
      })

      popup.current.setContent(content.current)
      popup.current.on('remove', () => {
        dispatch({ type: 'selected', value: undefined })
      })
      route.paths.forEach(path => {
        polylines.push(path.points.map(({ lat, lon }) => [lat, lon]))
      })
      L.polyline(polylines, { color: route.color }).addTo(map)
      route.stops.forEach(stop => {
        const direction = getDirectionForStop(stop.id, route.directions)
        const marker = L.marker([stop.lat, stop.lon], { icon })

        marker.addTo(map).bindPopup(popup.current)
        marker.on('click', () => {
          dispatch({ type: 'selected', value: { stop, direction } })
        })
      })
    }

    return () => {
      map.remove()
    }
  }, [bounds, agency, route, dispatch])

  if (selected && agency && route) {
    const { stop, direction } = selected

    return (
      <>
        {children}
        {createPortal(
          <Stop
            agency={agency}
            stop={stop}
            route={route}
            direction={direction}
            popup={popup.current}
          />,
          content.current
        )}
      </>
    )
  }

  return children
}

export { Layout }
export type { LayoutProps }
