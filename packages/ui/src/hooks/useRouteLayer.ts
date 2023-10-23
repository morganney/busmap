import { useEffect } from 'react'
import { divIcon, marker, polyline, latLng, latLngBounds } from 'leaflet'

import { useGlobals } from '../globals.js'

import type { Map, LayerGroup, Popup } from 'leaflet'
import type { Agency, BusmapAction, Route, Direction } from '../types.js'

type Point = [number, number]
interface UseRouteLayer {
  routeLayer: LayerGroup
  map: Map | null
  popup: Popup
}
interface RouteStopConfig {
  agency: Agency
  route: Route
  popup: Popup
  dispatch: (value: BusmapAction) => void
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
const addRouteStopMarkers = (layer: LayerGroup, config: RouteStopConfig) => {
  const icon = divIcon({
    iconSize: [7, 7],
    className: 'busmap-stop-icon',
    html: `
      <svg viewBox="0 0 100 100" width="7" height="7">
        <circle cx="50" cy="50" r="45" stroke-width="5" />
      </svg>
    `
  })
  const { route, agency, popup, dispatch } = config

  route.stops.forEach(stop => {
    const direction = getDirectionForStop(stop.id, route.directions)
    const stopMarker = marker([stop.lat, stop.lon], { icon })

    stopMarker.bindPopup(popup)
    stopMarker.on('click', () => {
      dispatch({ type: 'selected', value: { agency, route, stop, direction } })
    })
    layer.addLayer(stopMarker)
  })
}
const addRoutePolyline = (layer: LayerGroup, route: Route) => {
  const polylines: Point[][] = []

  route.paths.forEach(path => {
    polylines.push(path.points.map(({ lat, lon }) => [lat, lon]))
  })

  layer.addLayer(polyline(polylines, { color: route.color }))
}
const useRouteLayer = ({ routeLayer, map, popup }: UseRouteLayer) => {
  const { agency, route, dispatch } = useGlobals()

  // Create a route layer group for each combination of (agency, route) selected
  useEffect(() => {
    if (map) {
      if (agency && route) {
        const bnds = route.bounds

        routeLayer.clearLayers()
        map.fitBounds(
          latLngBounds(latLng(bnds.sw.lat, bnds.sw.lon), latLng(bnds.ne.lat, bnds.ne.lon))
        )
        addRoutePolyline(routeLayer, route)
        addRouteStopMarkers(routeLayer, {
          agency,
          route,
          popup,
          dispatch
        })
      }
    }
  }, [routeLayer, map, agency, route, popup, dispatch])
}

export { useRouteLayer }
