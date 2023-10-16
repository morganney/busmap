import { Marker } from 'leaflet'

import type { MarkerOptions, LatLng } from 'leaflet'
import type { Vehicle } from '../types.js'
import type { SpeedUnit } from '../contexts/settings/vehicle.js'

class VehicleMarker extends Marker {
  #vehicle: Vehicle
  #speedUnit: SpeedUnit

  constructor(
    latlng: LatLng,
    vehicle: Vehicle,
    speedUnit: SpeedUnit,
    options?: MarkerOptions
  ) {
    super(latlng, options)

    this.#vehicle = vehicle
    this.#speedUnit = speedUnit
  }

  get vehicle() {
    return this.#vehicle
  }

  set vehicle(value: Vehicle) {
    this.#vehicle = value
  }

  get speedUnit() {
    return this.#speedUnit
  }

  set speedUnit(value: SpeedUnit) {
    this.#speedUnit = value
  }
}

export { VehicleMarker }
