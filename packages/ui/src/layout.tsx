import L from 'leaflet'
import { useEffect, useContext, useRef } from 'react'
import { createPortal } from 'react-dom'

import { Globals } from './globals.js'
import { Selection } from './components/selection.js'

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
      return direction
    }
  }

  return directions[0]
}
const Layout: FC<LayoutProps> = ({ children }) => {
  const { center, route, agency, selected, dispatch } = useContext(Globals)
  const selection = useRef(document.createElement('div'))
  const popup = useRef(L.popup())

  useEffect(() => {
    const main = document.querySelector('main') as HTMLElement
    const map = L.map(main)
    const polylines: Point[][] = []

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)
    map.on('locationfound', evt => {
      L.marker(evt.latlng)
        .addTo(map)
        .bindPopup(
          `Your location within ${Intl.NumberFormat().format(evt.accuracy)} meters.`
        )
      dispatch({ type: 'locationSettled', value: true })
    })
    map.on('locationerror', () => {
      if (!agency) {
        map.setView(L.latLng(center.lat, center.lon), 13)
      }

      dispatch({ type: 'locationSettled', value: true })
    })

    if (route) {
      const bnds = route.bounds

      map.fitBounds(
        L.latLngBounds(
          L.latLng(bnds.sw.lat, bnds.sw.lon),
          L.latLng(bnds.ne.lat, bnds.ne.lon)
        )
      )
    } else {
      map.locate({ setView: true, enableHighAccuracy: true })
    }

    if (agency && route) {
      const icon = L.icon({
        iconUrl: '../assets/svg/circled.svg',
        iconSize: [7, 7]
      })

      popup.current.setContent(selection.current)
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
          dispatch({ type: 'selected', value: { agency, route, stop, direction } })
        })
      })
    }

    return () => {
      map.remove()
    }
  }, [center, agency, route, dispatch])

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
            popup={popup.current}
          />,
          selection.current
        )}
      </>
    )
  }

  return children
}

export { Layout }
export type { LayoutProps }
