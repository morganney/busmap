import { useEffect, useRef, useContext } from 'react'
import L from 'leaflet'

import { Globals } from '../globals.js'

import type { LayerGroup, MarkerOptions, LatLng } from 'leaflet'
import type { Vehicle, Route } from '../types.js'

type Quadrant = 'ne' | 'sw' | 'se' | 'nw'
interface UseVehiclesLayer {
  vehiclesLayer: LayerGroup
}
interface Dimensions {
  width: number
  height: number
}
interface DynamicStyles {
  route: Route
  dimensions: Dimensions
  vehicle: Vehicle
  marker: VehicleMarker
}

class VehicleMarker extends L.Marker {
  #vehicle: Vehicle

  constructor(latlng: LatLng, vehicle: Vehicle, options?: MarkerOptions) {
    super(latlng, options)

    this.#vehicle = vehicle
  }

  get vehicle() {
    return this.#vehicle
  }

  set vehicle(value: Vehicle) {
    this.#vehicle = value
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
const assignDynamicStyles = ({ dimensions, vehicle, marker, route }: DynamicStyles) => {
  const divIcon = marker.getElement()

  if (divIcon) {
    const { heading } = vehicle
    const { width, height } = dimensions
    const icon = marker.getIcon()
    const quadrant = getQuadrantFromHeading(heading)
    const divNode = divIcon.querySelector('div') as HTMLDivElement
    const headingNode = divIcon.querySelector('span:last-child') as HTMLSpanElement

    icon.options.className = `busmap-vehicle ${quadrant}`
    headingNode.style.transform = `rotate(${heading - 90}deg)`
    divNode.style.color = vehicle.predictable ? route.textColor : 'white'
    divNode.style.background = vehicle.predictable
      ? route.color
      : `
      repeating-linear-gradient(
        45deg,
        ${route.color},
        ${route.color} 5px,
        black 5px,
        black 10px
      )
    `

    /**
     * Position the anchors of the marker icon and popup.
     * The fudge factors (7,8) are related to the size of
     * the psuedo element used for the anchor triangle.
     */
    switch (quadrant) {
      case 'nw':
        icon.options.iconAnchor = [-8, height + 7]
        icon.options.popupAnchor = [Math.round(width / 2) + 8, -(height + 7)]
        break
      case 'se':
        icon.options.iconAnchor = [width + 7, -7]
        icon.options.popupAnchor = [-(Math.round(width / 2) + 7), 7]
        break
      case 'sw':
        icon.options.iconAnchor = [width + 7, height + 7]
        icon.options.popupAnchor = [-(Math.round(width / 2) + 7), -(height + 7)]
        break
      default: // The northeast region 'ne'
        icon.options.iconAnchor = [-8, -7]
        icon.options.popupAnchor = [Math.round(width / 2) + 8, 7]
    }

    marker.setIcon(icon)
  }
}
const getVehiclePopupContent = (vehicle: Vehicle, route: Route) => {
  const direction = route.directions.find(dir => dir.id === vehicle.directionId)

  return `
    <dl>
      <dt>Route</dt>
      <dd>${route.title ?? route.shortTitle}</dd>
      <dt>Direction</dt>
      <dd>${direction?.title ?? direction?.shortTitle ?? 'N/A'}
      <dt>ID</dt>
      <dd>${vehicle.id}</dd>
      <dt>Speed</dt>
      <dd>${vehicle.kph} (kph)</dd>
      <dt>Heading</dt>
      <dd>${vehicle.heading} (deg)</dd>
      <dt>Predictable</dt>
      <dd>${vehicle.predictable}</dd>
      <dt>Last Report</dt>
      <dd>${vehicle.secsSinceReport} (sec)</dd>
    </dl>
  `
}
const useVehiclesLayer = ({ vehiclesLayer }: UseVehiclesLayer) => {
  const { route, vehicles } = useContext(Globals)
  const iconDimensions = useRef<Dimensions | null>(null)

  useEffect(() => {
    iconDimensions.current = null
  }, [route])

  useEffect(() => {
    if (Array.isArray(vehicles) && route) {
      const markers = vehiclesLayer.getLayers() as VehicleMarker[]

      for (const vehicle of vehicles) {
        const marker = markers.find(m => m.vehicle.id === vehicle.id)

        if (marker && iconDimensions.current) {
          assignDynamicStyles({
            route,
            marker,
            vehicle,
            dimensions: iconDimensions.current
          })
          marker.vehicle = vehicle
          marker.getPopup()?.setContent(getVehiclePopupContent(vehicle, route))
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
          const marker = new VehicleMarker(L.latLng(vehicle.lat, vehicle.lon), vehicle, {
            icon
          })
          const popup = L.popup({
            className: 'busmap-vehicle-popup',
            content: getVehiclePopupContent(vehicle, route)
          })

          marker.bindPopup(popup)
          popup.on('remove', () => {
            popup.getElement()?.classList.remove('selected')
          })
          marker.on('click', () => {
            popup.getElement()?.classList.add('selected')
            popup.setContent(getVehiclePopupContent(marker.vehicle, route))
          })

          title.appendChild(document.createTextNode(route.title))
          heading.appendChild(document.createTextNode('➞'))
          div.appendChild(title)
          div.appendChild(heading)

          vehiclesLayer.addLayer(marker)

          if (!iconDimensions.current) {
            const box = div.getBoundingClientRect()
            // Adjust for the border around the L.divIcon.
            iconDimensions.current = { width: box.width + 2, height: box.height + 2 }
          }

          assignDynamicStyles({
            route,
            marker,
            vehicle,
            dimensions: iconDimensions.current
          })
        }
      }

      for (const m of markers) {
        const vehicle = vehicles.find(({ id }) => id === m.vehicle.id)

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
