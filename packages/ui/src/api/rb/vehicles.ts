import { ROOT } from './common.js'

import { transport } from '../transport.js'
import { errors } from '../errors.js'

import type { Agency, Route, Vehicle } from '../../types.js'

const getAll = async (agencyId?: Agency['id'], routeId?: Route['id']) => {
  if (!agencyId || !routeId) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  const vehicles = await transport.fetch<Vehicle[]>(
    `${ROOT}/agencies/${agencyId}/routes/${routeId}/vehicles`
  )

  return vehicles
}

const get = async (agencyId?: Agency['id'], vehicleId?: Vehicle['id']) => {
  if (!agencyId || !vehicleId) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  const vehicle = await transport.fetch<Vehicle>(
    `${ROOT}/agencies/${agencyId}/vehicles/${vehicleId}`
  )

  return vehicle
}

export { get, getAll }
