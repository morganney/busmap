import { Marker } from 'leaflet'

import type { MarkerOptions, LatLng } from 'leaflet'
import type { Vehicle } from '../types.js'

class VehicleMarker extends Marker {
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

export { VehicleMarker }
