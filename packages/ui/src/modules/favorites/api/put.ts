import { transport } from '@core/api/transport.js'
import { errors } from '@core/api/errors.js'

import type { Favorite } from '../types.js'

const put = async (favorite: Favorite) => {
  if (!favorite) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  const resp = await transport.fetch<{ created: string }>('/favorite/add', {
    method: 'PUT',
    body: JSON.stringify({
      favorite
    })
  })

  return resp
}

export { put }
