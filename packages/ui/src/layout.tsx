import L from 'leaflet'
import { useEffect, useContext, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Globals } from './globals.js'
import { Selection } from './components/selection.js'

import type { FC, ReactNode } from 'react'
import type { Map, Popup, Marker, LayerGroup } from 'leaflet'
import type { BusmapAction, Direction, Route, Agency } from './types.js'

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
const getRoutePolyline = (route: Route) => {
  const polylines: Point[][] = []

  route.paths.forEach(path => {
    polylines.push(path.points.map(({ lat, lon }) => [lat, lon]))
  })

  return L.polyline(polylines, { color: route.color })
}
const getRouteStopMarkers = (
  agency: Agency,
  route: Route,
  popup: Popup,
  dispatch: (value: BusmapAction) => void
) => {
  const markers: Marker[] = []
  const icon = L.icon({
    iconUrl: '../assets/svg/circled.svg',
    iconSize: [7, 7]
  })

  route.stops.forEach(stop => {
    const direction = getDirectionForStop(stop.id, route.directions)
    const marker: L.Marker = L.marker([stop.lat, stop.lon], { icon })

    marker.bindPopup(popup)
    marker.on('click', () => {
      dispatch({ type: 'selected', value: { agency, route, stop, direction } })
    })
    markers.push(marker)
  })

  return markers
}
const Layout: FC<LayoutProps> = ({ children }) => {
  const { route, agency, selected, locationSettled, dispatch } = useContext(Globals)
  const [map, setMap] = useState<L.Map | null>(null)
  const selectionRef = useRef(document.createElement('div'))
  const popupRef = useRef(L.popup())
  const mapRef = useRef<Map>()
  const routeLayerRef = useRef<LayerGroup>()

  // Initialize map
  useEffect(() => {
    mapRef.current = L.map(document.querySelector('main') as HTMLElement)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapRef.current)
    popupRef.current.setContent(selectionRef.current)
    popupRef.current.on('remove', () => {
      dispatch({ type: 'selected', value: undefined })
    })
    setMap(mapRef.current)

    return () => {
      mapRef.current?.remove()
    }
  }, [dispatch])

  // Initialize location search
  useEffect(() => {
    if (map && !locationSettled) {
      map.on('locationfound', evt => {
        L.marker(evt.latlng)
          .addTo(map)
          .bindPopup(
            `Your location within ${Intl.NumberFormat().format(evt.accuracy)} meters.`
          )
        dispatch({ type: 'locationSettled', value: true })
      })
      map.on('locationerror', () => {
        // Roughly North America (USA, Cananda, Mexico)
        map.fitBounds(
          L.latLngBounds(L.latLng(6.089467, -128.009169), L.latLng(73.28682, -78.506175))
        )
        dispatch({ type: 'locationSettled', value: true })
      })
      map.locate({ setView: true, enableHighAccuracy: true })
    }
  }, [map, locationSettled, dispatch])

  // Create a route layer group for each combination of (agency, route) selected
  useEffect(() => {
    if (map) {
      if (agency && route) {
        const routePolyline = getRoutePolyline(route)
        const routeStopMarkers = getRouteStopMarkers(
          agency,
          route,
          popupRef.current,
          dispatch
        )
        const routeLayer = L.layerGroup([routePolyline, ...routeStopMarkers])
        const bnds = route.bounds

        if (routeLayerRef.current) {
          routeLayerRef.current.clearLayers()
        }

        map.fitBounds(
          L.latLngBounds(
            L.latLng(bnds.sw.lat, bnds.sw.lon),
            L.latLng(bnds.ne.lat, bnds.ne.lon)
          )
        )
        routeLayer.addTo(map)
        routeLayerRef.current = routeLayer
      }
    }
  }, [map, agency, route, dispatch])

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
            popup={popupRef.current}
          />,
          selectionRef.current
        )}
      </>
    )
  }

  return children
}

export { Layout }
export type { LayoutProps }
