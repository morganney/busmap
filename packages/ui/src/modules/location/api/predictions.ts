import { ROOT } from '@core/api/rb/common.js'
import { transport } from '@core/api/transport.js'
import { errors } from '@core/api/errors.js'

import type { Prediction, Point } from '@core/types.js'

const get = async (position?: Point) => {
  if (!position) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  const preds = await transport.fetch<Prediction[]>(
    `${ROOT}/locations/${position.lat},${position.lon}/predictions`
  )

  return preds
}

export { get }
