import errors from 'http-errors'

import type { ErrorRequestHandler } from 'express'

const handler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  res.status(500).json(new errors.InternalServerError())
}
const error = { handler }

export { error }
