import { ROOT } from './common.js'

import { transport } from '../transport.js'
import { errors } from '../errors.js'

import type { Prediction } from '../../types.js'

const getForStop = async (agencyId?: string, routeId?: string, stopId?: string) => {
  if (!agencyId || !routeId || !stopId) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  const preds = await transport.fetch<Prediction[]>(
    `${ROOT}/agencies/${agencyId}/routes/${routeId}/stops/${stopId}/predictions`
  )

  return preds
}

export { getForStop }
