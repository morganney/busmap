import { useEffect } from 'react'
import L from 'leaflet'

import type { LayerGroup, MarkerOptions, LatLng } from 'leaflet'
import type { Vehicle, Route, Direction } from '../types.js'

interface UseRouteVehiclesLayer {
  direction?: Direction
  route?: Route
  vehicles?: Vehicle[]
  vehiclesLayer: LayerGroup
}
interface VehicleMarkerData {
  vehicleId: string
  directionId: string
}

class VehicleMarker extends L.Marker {
  #data: VehicleMarkerData = { vehicleId: '', directionId: '' }

  constructor(latlng: LatLng, data: VehicleMarkerData, options?: MarkerOptions) {
    super(latlng, options)

    this.#data = data
  }

  get data() {
    return this.#data
  }
}
const useVehiclesLayer = ({
  route,
  vehicles,
  vehiclesLayer
}: UseRouteVehiclesLayer) => {
  useEffect(() => {
    if (Array.isArray(vehicles) && route) {
      const markers = vehiclesLayer.getLayers() as VehicleMarker[]

      for (const v of vehicles) {
        const marker = markers.find(({ data }) => data.vehicleId === v.id)

        if (marker) {
          const ele = marker.getElement()

          if (ele) {
            const headingNode = ele.querySelector('span:last-child') as HTMLSpanElement

            if (headingNode) {
              headingNode.style.transform = `rotate(${v.heading}deg)`
            }
          }

          marker.setLatLng(L.latLng(v.lat, v.lon))
        } else {
          const div = document.createElement('div')
          const title = document.createElement('span')
          const heading = document.createElement('span')
          const icon = L.divIcon({
            iconAnchor: [0, 0],
            className: 'busmap-vehicle',
            html: div
          })

          title.appendChild(document.createTextNode(route.title))
          heading.appendChild(document.createTextNode('↑'))
          div.appendChild(title)
          div.appendChild(heading)
          div.style.background = route.color
          div.style.color = route.textColor
          heading.style.transform = `rotate(${v.heading}deg)`

          vehiclesLayer.addLayer(
            new VehicleMarker(
              L.latLng(v.lat, v.lon),
              { vehicleId: v.id, directionId: v.directionId },
              { icon }
            )
          )
        }
      }

      for (const m of markers) {
        const vehicle = vehicles.find(({ id }) => id === m.data.vehicleId)

        if (!vehicle) {
          m.remove()
        }
      }
    } else {
      vehiclesLayer.clearLayers()
    }
  }, [vehicles, vehiclesLayer, route])
}

export { useVehiclesLayer }
