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
  const predictions: Prediction[] = []

  preds.forEach(pred => {
    pred.agency.id = pred.agency.id.replace(/sfmta-cis/, 'sfmuni-sandbox')

    /**
     * Not able to support SF Bay Ferry agency.
     */
    if (pred.agency.id !== 'bawt') {
      predictions.push(pred)
    }
  })

  return predictions
}

export { get }
