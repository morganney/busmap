import { transport } from '@core/api/transport.js'

import type { RiderFavoriteItem } from '@busmap/common/types/favorites'

const get = async () => {
  const resp = await transport.fetch<RiderFavoriteItem[]>('/favorite/list')

  return resp
}

export { get }
