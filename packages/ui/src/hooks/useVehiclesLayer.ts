import { useEffect, useRef } from 'react'
import L from 'leaflet'

import type { LayerGroup, MarkerOptions, LatLng } from 'leaflet'
import type { Vehicle, Route, Direction } from '../types.js'

type Quadrant = 'ne' | 'sw' | 'se' | 'nw'
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
interface Dimensions {
  width: number
  height: number
}
interface HeadingStyles {
  dimensions: Dimensions
  vehicle: Vehicle
  marker: VehicleMarker
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
const isBetween = (value: number, range: number[]) => {
  return value <= range[1] && value >= range[0]
}
const getQuadrantFromHeading = (heading: number): Quadrant => {
  if (isBetween(heading, [0, 90])) {
    return 'ne'
  }

  if (isBetween(heading, [91, 180])) {
    return 'se'
  }

  if (isBetween(heading, [181, 270])) {
    return 'sw'
  }

  return 'nw'
}
const assignHeadingStyles = ({ dimensions, vehicle, marker }: HeadingStyles) => {
  const divIcon = marker.getElement()

  if (divIcon) {
    const { heading } = vehicle
    const icon = marker.getIcon()
    const quadrant = getQuadrantFromHeading(heading)
    const headingNode = divIcon.querySelector('span:last-child') as HTMLSpanElement

    icon.options.className = `busmap-vehicle ${quadrant}`
    headingNode.style.transform = `rotate(${heading}deg)`

    switch (quadrant) {
      case 'nw':
        icon.options.iconAnchor = [-8, dimensions.height + 7]
        break
      case 'se':
        icon.options.iconAnchor = [dimensions.width + 7, -7]
        break
      case 'sw':
        icon.options.iconAnchor = [dimensions.width + 7, dimensions.height + 7]
        break
      default: // The northeast region 'ne'
        icon.options.iconAnchor = [-8, -7]
    }

    marker.setIcon(icon)
  }
}
const useVehiclesLayer = ({ route, vehicles, vehiclesLayer }: UseRouteVehiclesLayer) => {
  const iconDimensions = useRef<Dimensions | null>(null)

  useEffect(() => {
    iconDimensions.current = null
  }, [route])

  useEffect(() => {
    if (Array.isArray(vehicles) && route) {
      const markers = vehiclesLayer.getLayers() as VehicleMarker[]
      const predictable = vehicles.filter(({ predictable }) => predictable)

      for (const vehicle of predictable) {
        const marker = markers.find(({ data }) => data.vehicleId === vehicle.id)

        if (marker && iconDimensions.current) {
          assignHeadingStyles({
            marker,
            vehicle,
            dimensions: iconDimensions.current
          })
          marker.setLatLng(L.latLng(vehicle.lat, vehicle.lon))
        } else {
          const div = document.createElement('div')
          const title = document.createElement('span')
          const heading = document.createElement('span')
          const quad = getQuadrantFromHeading(vehicle.heading)
          const icon = L.divIcon({
            iconAnchor: [0, 0],
            className: `busmap-vehicle ${quad}`,
            html: div
          })
          const marker = new VehicleMarker(
            L.latLng(vehicle.lat, vehicle.lon),
            { vehicleId: vehicle.id, directionId: vehicle.directionId },
            { icon }
          )

          title.appendChild(document.createTextNode(route.title))
          heading.appendChild(document.createTextNode('↑'))
          div.appendChild(title)
          div.appendChild(heading)
          heading.style.transform = `rotate(${vehicle.heading}deg)`
          div.style.background = route.color
          div.style.color = route.textColor

          vehiclesLayer.addLayer(marker)

          if (!iconDimensions.current) {
            const box = div.getBoundingClientRect()
            // Adjust for the border around the L.divIcon.
            iconDimensions.current = { width: box.width + 2, height: box.height + 2 }
          }

          assignHeadingStyles({
            marker,
            vehicle,
            dimensions: iconDimensions.current
          })
        }
      }

      for (const m of markers) {
        const vehicle = predictable.find(({ id }) => id === m.data.vehicleId)

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
