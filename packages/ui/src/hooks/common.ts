import { Marker } from 'leaflet'

import type { MarkerOptions, LatLng } from 'leaflet'
import type { Vehicle } from '../types.js'
import type { SpeedUnit } from '../contexts/util.js'

interface VehicleMarkerConfig {
  vehicle: Vehicle
  speedUnit: SpeedUnit
  hidden: boolean
}

class VehicleMarker extends Marker {
  #config: VehicleMarkerConfig

  constructor(latlng: LatLng, config: VehicleMarkerConfig, options?: MarkerOptions) {
    super(latlng, options)

    this.#config = config
  }

  set config(value: VehicleMarkerConfig) {
    this.#config = value
  }

  get config() {
    return this.#config
  }

  get vehicle() {
    return this.#config.vehicle
  }

  set vehicle(value: Vehicle) {
    this.#config.vehicle = value
  }

  get speedUnit() {
    return this.#config.speedUnit
  }

  set speedUnit(value: SpeedUnit) {
    this.#config.speedUnit = value
  }

  set hidden(value: boolean) {
    this.#config.hidden = value
  }

  get hidden() {
    return this.#config.hidden
  }
}

export const VEHICLE_PANE = 'busmap-vehicle-pane'
export { VehicleMarker }
