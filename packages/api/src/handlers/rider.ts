import errors from 'http-errors'
import makeDebug from 'debug'

import { updateRiderSettings } from '../queries/rider.js'

import type { Request, Response } from 'express'
import type { HttpError } from 'http-errors'

const debug = makeDebug('busmap')
const rider = {
  async settings(req: Request, res: Response<void | HttpError<500> | HttpError<400>>) {
    if (
      req.body.settings &&
      typeof req.body.settings === 'object' &&
      req.session?.userId
    ) {
      debug('updating user with new settings', req.body.settings)
      try {
        await updateRiderSettings(req.body.settings, req.session.userId)

        return res.status(204).send()
      } catch (err) {
        return res.status(500).json(new errors.InternalServerError())
      }
    }

    return res.status(400).json(new errors.BadRequest())
  }
}

export { rider }
