import { transport } from '@core/api/transport.js'
import { errors } from '@core/api/errors.js'

import type { RiderFavorite } from '@busmap/common/types/favorites'
import type { Favorite } from '../types.js'

const remove = async (favorite: Favorite) => {
  if (!favorite) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  const resp = await transport.fetch<RiderFavorite>('/favorite/remove', {
    method: 'DELETE',
    body: JSON.stringify({
      favorite
    })
  })

  return resp
}

export { remove }
