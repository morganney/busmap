import { transport } from '@core/api/transport.js'
import { errors } from '@core/api/errors.js'

import type { RiderSettings } from '@busmap/common/types/settings'

const put = async (settings: RiderSettings): Promise<void> => {
  if (!settings) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  await transport.fetch('/rider/settings', {
    method: 'PUT',
    body: JSON.stringify({
      settings
    })
  })
}

export { put }
