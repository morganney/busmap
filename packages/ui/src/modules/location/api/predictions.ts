import { ROOT } from '@core/api/rb/common.js'
import { transport } from '@core/api/transport.js'
import { errors } from '@core/api/errors.js'

import type { Prediction, Point } from '@core/types.js'

const get = async (point?: Point) => {
  if (!point) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  const preds = await transport.fetch<Prediction[]>(
    `${ROOT}/locations/${point.lat},${point.lon}/predictions`
  )

  return preds
}

export { get }
