import errors from 'http-errors'

import type { Request, Response, NextFunction } from 'express'

const authenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user) {
    return res.status(401).json(new errors.Unauthorized())
  }

  next()
}

export { authenticated }
