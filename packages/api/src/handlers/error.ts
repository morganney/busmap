import errors from 'http-errors'

import { logger } from '../logger.js'

import type { ErrorRequestHandler } from 'express'

const handler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err, 'Error handler invoked.')

  if (res.headersSent) {
    return next(err)
  }

  res.status(500).json(new errors.InternalServerError())
}
const error = { handler }

export { error }
