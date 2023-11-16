import { ROOT, modifyMuniTitle } from './common.js'

import { transport } from '../transport.js'
import { errors } from '../errors.js'

import type { Prediction } from '../../types.js'

const getForTuples = async (
  agencyId?: string,
  tuples?: string[],
  signal?: AbortSignal
) => {
  if (!agencyId || !tuples) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  const preds = await transport.fetch<Prediction[]>(
    `${ROOT}/agencies/${agencyId}/tuples/${tuples.join(',')}/predictions`,
    { signal }
  )

  preds.forEach(pred => {
    modifyMuniTitle(pred.agency)
    delete pred._links
  })

  return preds
}

export { getForTuples }
