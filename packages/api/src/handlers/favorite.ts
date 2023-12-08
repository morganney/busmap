import makeDebug from 'debug'
import errors from 'http-errors'

import { addRiderFavorite } from '../queries/favorite.js'

import type { Request, Response } from 'express'
import type { Favorite } from '@busmap/common/types/favorites'

const debug = makeDebug('busmap')
const favorite = {
  async add(req: Request<object, object, { favorite: Favorite }>, res: Response) {
    const { favorite } = req.body

    debug('received favorite for put', favorite)

    if (favorite && typeof favorite === 'object' && req.session?.userId) {
      const { agency, route, stop } = favorite

      if (agency?.id && route?.id && stop?.id) {
        const { userId } = req.session

        try {
          const riderFavoriteRow = await addRiderFavorite(favorite, userId)

          if (riderFavoriteRow[0]) {
            debug('favorite created for rider', userId)
            return res.json({ created: riderFavoriteRow[0].created })
          }

          return res.status(409).json(new errors.Conflict())
        } catch (err) {
          return res.status(500).json(new errors.InternalServerError())
        }
      }
    }

    return res.status(400).json(new errors.BadRequest())
  }
}

export { favorite }
