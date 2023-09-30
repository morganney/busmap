import { useEffect } from 'react'
import L from 'leaflet'

import type { Map, LayerGroup } from 'leaflet'
import type { Stop, Vehicle, Prediction } from '../types.js'

interface UsePredictedVehiclesLayer {
  map: Map | null
  stop?: Stop
  vehicles?: Vehicle[]
  predictions?: Prediction[]
  predVehLayer: LayerGroup
}

const usePredictedVehiclesLayer = ({
  map,
  stop,
  vehicles,
  predictions,
  predVehLayer
}: UsePredictedVehiclesLayer) => {
  useEffect(() => {
    if (!stop) {
      predVehLayer.clearLayers()
    } else if (
      Array.isArray(predictions) &&
      predictions.length &&
      Array.isArray(vehicles) &&
      map
    ) {
      const ids = predictions[0].values.slice(0, 3).map(pred => pred.vehicle.id)

      predVehLayer.clearLayers()
      vehicles
        .filter(veh => ids.includes(veh.id))
        .forEach(veh => {
          predVehLayer.addLayer(L.marker(L.latLng(veh.lat, veh.lon)))
        })
    }
  }, [predictions, stop, vehicles, map, predVehLayer])
}

export { usePredictedVehiclesLayer }
