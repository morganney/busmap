import { transport } from '@core/api/transport.js'

import type { RiderFavoriteListItem } from '@busmap/common/types/favorites'

const get = async () => {
  const resp = await transport.fetch<RiderFavoriteListItem[]>('/favorite/list')

  return resp
}

export { get }
