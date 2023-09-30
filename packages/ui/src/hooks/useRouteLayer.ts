import { useEffect } from 'react'
import L from 'leaflet'

import type { Map, LayerGroup, Popup } from 'leaflet'
import type { Agency, BusmapAction, Route, Direction } from '../types.js'

type Point = [number, number]
interface UseRouteLayer {
  routeLayer: LayerGroup
  map: Map | null
  agency?: Agency
  route?: Route
  popup: Popup
  dispatch: (value: BusmapAction) => void
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
  const icon = L.icon({
    iconUrl: '../../assets/svg/circled.svg',
    iconSize: [7, 7]
  })
  const { route, agency, popup, dispatch } = config

  route.stops.forEach(stop => {
    const direction = getDirectionForStop(stop.id, route.directions)
    const marker: L.Marker = L.marker([stop.lat, stop.lon], { icon })

    marker.bindPopup(popup)
    marker.on('click', () => {
      dispatch({ type: 'selected', value: { agency, route, stop, direction } })
    })
    layer.addLayer(marker)
  })
}
const addRoutePolyline = (layer: LayerGroup, route: Route) => {
  const polylines: Point[][] = []

  route.paths.forEach(path => {
    polylines.push(path.points.map(({ lat, lon }) => [lat, lon]))
  })

  layer.addLayer(L.polyline(polylines, { color: route.color }))
}
const useRouteLayer = ({
  routeLayer,
  map,
  agency,
  route,
  popup,
  dispatch
}: UseRouteLayer) => {
  // Create a route layer group for each combination of (agency, route) selected
  useEffect(() => {
    if (map) {
      if (agency && route) {
        const bnds = route.bounds

        routeLayer.clearLayers()
        addRoutePolyline(routeLayer, route)
        addRouteStopMarkers(routeLayer, {
          agency,
          route,
          popup,
          dispatch
        })
        map.fitBounds(
          L.latLngBounds(
            L.latLng(bnds.sw.lat, bnds.sw.lon),
            L.latLng(bnds.ne.lat, bnds.ne.lon)
          )
        )
      }
    }
  }, [routeLayer, map, agency, route, popup, dispatch])
}

export { useRouteLayer }
