import { useEffect } from 'react'
import L from 'leaflet'

import type { LayerGroup, MarkerOptions, LatLng } from 'leaflet'
import type { Vehicle } from '../types.js'

interface UseRouteVehiclesLayer {
  vehicles?: Vehicle[]
  routeVehiclesLayer: LayerGroup
}

class VehicleMarker extends L.Marker {
  #vehicleId: string = ''

  constructor(latlng: LatLng, id: string, options?: MarkerOptions) {
    super(latlng, options)

    this.#vehicleId = id
  }

  get vehicleId() {
    return this.#vehicleId
  }
}
const updateVehicleMarkers = (group: LayerGroup, vehicles: Vehicle[]) => {
  const markers = group.getLayers() as VehicleMarker[]

  for (const v of vehicles) {
    const vPrev = markers.find(m => m.vehicleId === v.id)

    if (vPrev) {
      vPrev.setLatLng(L.latLng(v.lat, v.lon))
    } else {
      const span = document.createElement('span')
      const arrow = document.createTextNode('↑')
      const vehicleIcon = L.divIcon({ className: 'vehicle-marker', html: span })
      const vm = new VehicleMarker(L.latLng(v.lat, v.lon), v.id, { icon: vehicleIcon })

      span.appendChild(arrow)
      span.style.transform = `rotate(${v.heading}deg)`
      group.addLayer(vm)

      const ele = vm.getElement()

      if (ele) {
        ele.style.width = '35px'
        ele.style.height = '10px'
        ele.style.margin = '0'
      }
    }
  }

  for (const marker of markers) {
    if (!vehicles.some(({ id }) => id === marker.vehicleId)) {
      marker.remove()
    }
  }
}
const useRouteVehiclesLayer = ({
  vehicles,
  routeVehiclesLayer
}: UseRouteVehiclesLayer) => {
  useEffect(() => {
    if (Array.isArray(vehicles)) {
      updateVehicleMarkers(routeVehiclesLayer, vehicles)
    }
  }, [vehicles, routeVehiclesLayer])
}

export { useRouteVehiclesLayer }
