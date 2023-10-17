import { useEffect, useRef } from 'react'
import L from 'leaflet'

import { VehicleMarker } from './common.js'

import { useGlobals } from '../globals.js'
import { useVehicles } from '../contexts/vehicles.js'
import { useVehicleSettings } from '../contexts/settings/vehicle.js'
import { PredictedVehiclesColors } from '../utils.js'

import type { LayerGroup } from 'leaflet'
import type { Vehicle, Route, Pred } from '../types.js'

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
  preds: Pred[]
  markPredictedVehicles: boolean
}
enum Quadrant {
  NE = 'ne',
  NW = 'nw',
  SW = 'sw',
  SE = 'se'
}

const quadrants = Object.values(Quadrant)
const predVehicleColors = Object.values(PredictedVehiclesColors)
const isBetween = (value: number, range: number[]) => {
  return value <= range[1] && value >= range[0]
}
const getQuadrantFromHeading = (heading: number): Quadrant => {
  if (isBetween(heading, [0, 90])) {
    return Quadrant.NE
  }

  if (isBetween(heading, [91, 180])) {
    return Quadrant.SE
  }

  if (isBetween(heading, [181, 270])) {
    return Quadrant.SW
  }

  return Quadrant.NW
}
const assignDynamicStyles = ({
  markPredictedVehicles,
  dimensions,
  vehicle,
  marker,
  route,
  preds
}: DynamicStyles) => {
  const divIcon = marker.getElement()

  if (divIcon) {
    const { heading } = vehicle
    const { width, height } = dimensions
    const icon = marker.getIcon()
    const quadrant = getQuadrantFromHeading(heading)
    const carNode = divIcon.querySelector('div') as HTMLDivElement
    const headingNode = divIcon.querySelector('span:last-child') as HTMLSpanElement

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

    /**
     * Note, adjust the marker's underlying icon DOM AFTER calling
     * setIcon(), so as not to lose any previously applied values.
     */

    divIcon.classList.remove(...quadrants)
    divIcon.classList.add(quadrant)
    carNode.style.color = vehicle.predictable ? route.textColor : 'white'
    carNode.style.background = vehicle.predictable
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
    headingNode.style.transform = `rotate(${heading - 90}deg)`

    // Mark predicted vehicles
    if (markPredictedVehicles) {
      let found = false
      let i = 0

      while (i < preds.length && !found) {
        if (preds[i].vehicle.id === vehicle.id) {
          found = true
        } else {
          i++
        }
      }

      if (found) {
        carNode.style.color = 'white'
        carNode.style.background = predVehicleColors[i]
      }
    }
  }
}
/**
 * @NOTE: Some agencies, like sfmuni-sandbox, will return directionId's
 * for vehicles that correspond to no directionId from a route config.
 *
 * The outcome is a 'N/A' in the vehicle poupup, despite the selector form
 * showing the correct direction. Basically a config error from the API source.
 */
const getVehiclePopupContent = (marker: VehicleMarker, route: Route) => {
  const { vehicle, speedUnit } = marker
  const direction = route.directions.find(dir => dir.id === vehicle.directionId)
  const speed = speedUnit === 'mph' ? Math.round(vehicle.kph / 1.609) : vehicle.kph

  return `
    <dl>
      <dt>Route</dt>
      <dd>${route.title ?? route.shortTitle}</dd>
      <dt>Direction</dt>
      <dd>${direction?.title ?? direction?.shortTitle ?? 'N/A'}
      <dt>ID</dt>
      <dd>${vehicle.id}</dd>
      <dt>Speed</dt>
      <dd>${speed} (${speedUnit})</dd>
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
  const vehicles = useVehicles()
  const { route, predictions } = useGlobals()
  const { visible, markPredictedVehicles, speedUnit } = useVehicleSettings()

  const iconDimensions = useRef<Dimensions | null>(null)
  const preds = useRef(predictions?.length ? predictions[0].values.slice(0, 3) : [])

  useEffect(() => {
    iconDimensions.current = null
  }, [route])

  useEffect(() => {
    const nextPreds = predictions?.length ? predictions[0].values.slice(0, 3) : []

    preds.current = nextPreds
  }, [predictions])

  useEffect(() => {
    if (visible && Array.isArray(vehicles) && route) {
      const markers = vehiclesLayer.getLayers() as VehicleMarker[]

      for (const vehicle of vehicles) {
        const marker = markers.find(m => m.vehicle.id === vehicle.id)

        if (marker && iconDimensions.current) {
          assignDynamicStyles({
            route,
            marker,
            vehicle,
            markPredictedVehicles,
            preds: preds.current,
            dimensions: iconDimensions.current
          })
          marker.vehicle = vehicle
          marker.speedUnit = speedUnit
          marker.getPopup()?.setContent(getVehiclePopupContent(marker, route))
          marker.setLatLng(L.latLng(vehicle.lat, vehicle.lon))
        } else {
          const div = document.createElement('div')
          const title = document.createElement('span')
          const heading = document.createElement('span')
          const icon = L.divIcon({
            iconAnchor: [0, 0],
            className: 'busmap-vehicle',
            html: div
          })
          const marker = new VehicleMarker(
            L.latLng(vehicle.lat, vehicle.lon),
            vehicle,
            speedUnit,
            {
              icon
            }
          )
          const popup = L.popup({
            className: 'busmap-vehicle-popup',
            content: getVehiclePopupContent(marker, route)
          })

          marker.bindPopup(popup)
          popup.on('remove', () => {
            popup.getElement()?.classList.remove('selected')
          })
          marker.on('click', () => {
            popup.getElement()?.classList.add('selected')
            popup.setContent(getVehiclePopupContent(marker, route))
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
            markPredictedVehicles,
            preds: preds.current,
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
  }, [visible, vehicles, vehiclesLayer, route, markPredictedVehicles, speedUnit])
}

export { useVehiclesLayer }
