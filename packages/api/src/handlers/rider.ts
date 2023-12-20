import errors from 'http-errors'
import makeDebug from 'debug'

import { updateRiderSettings } from '../queries/rider.js'

import type { Request, Response } from 'express'
import type { HttpError } from 'http-errors'
import type { RiderSettings } from '@busmap/common/types/settings'

const debug = makeDebug('busmap')
const rider = {
  async settings(
    req: Request,
    res: Response<RiderSettings | HttpError<500> | HttpError<400>>
  ) {
    if (
      req.body.settings &&
      typeof req.body.settings === 'object' &&
      req.session?.userId
    ) {
      debug('updating user with new settings', req.body.settings)
      try {
        const riderSettingsRow = await updateRiderSettings(
          req.body.settings,
          req.session.userId
        )

        /**
         * Side note, using HTTP 204 with no content (void) response
         * causes TypeScript wrangling in the UI having to check for
         * `undefined` (or `null`) responses. Not worth the extra work,
         * especially since TypeScript can't really guarantee types
         * across the network.
         */
        return res.json(riderSettingsRow[0] ?? null)
      } catch (err) {
        return res.status(500).json(new errors.InternalServerError())
      }
    }

    return res.status(400).json(new errors.BadRequest())
  }
}

export { rider }
