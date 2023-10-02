import { useRef, useEffect } from 'react'
import L from 'leaflet'

import type { LayerGroup } from 'leaflet'
import type { Vehicle } from '../types.js'

interface UseRouteVehiclesLayer {
  vehicles?: Vehicle[]
  routeVehiclesLayer: LayerGroup
}

const usePrevious = (vehicles?: Vehicle[]) => {
  const ref = useRef<Vehicle[]>()

  useEffect(() => {
    ref.current = vehicles ?? []
  }, [vehicles])

  return ref.current
}
const useRouteVehiclesLayer = ({
  vehicles,
  routeVehiclesLayer
}: UseRouteVehiclesLayer) => {
  const prev = usePrevious(vehicles)

  useEffect(() => {
    if (Array.isArray(vehicles)) {
      routeVehiclesLayer.clearLayers()

      for (const veh of vehicles) {
        routeVehiclesLayer.addLayer(
          L.marker(L.latLng(veh.lat, veh.lon)).bindPopup(`${veh.id}:${veh.directionId}`)
        )
      }
    }
  }, [vehicles, routeVehiclesLayer, prev])
}

export { useRouteVehiclesLayer }
