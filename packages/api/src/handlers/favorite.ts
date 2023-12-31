import makeDebug from 'debug'
import errors from 'http-errors'

import { logger } from '../logger.js'
import {
  addRiderFavorite,
  getRiderFavorites,
  removeRiderFavorite
} from '../queries/favorite.js'

import type { Request, Response } from 'express'
import type {
  Favorite,
  RiderFavorite,
  RiderFavoriteItem
} from '@busmap/common/types/favorites'
import type { HttpError } from 'http-errors'

const debug = makeDebug('busmap')
const favorite = {
  async add(req: Request<object, object, { favorite: Favorite }>, res: Response) {
    const { favorite } = req.body

    debug('received favorite for put', favorite)

    if (favorite && typeof favorite === 'object' && req.session?.userId) {
      const { agency, route, stop } = favorite

      if (agency.id && route.id && stop.id) {
        const { userId } = req.session

        try {
          const riderFavoriteRow = await addRiderFavorite(favorite, userId)

          if (riderFavoriteRow[0]) {
            debug('favorite created for rider', userId)
            return res.json({ created: riderFavoriteRow[0].created })
          }

          return res.status(409).json(new errors.Conflict())
        } catch (err) {
          if (err instanceof Error) {
            logger.error({ ...err, userId, favorite }, 'Error adding rider favorite.')
          }

          return res.status(500).json(new errors.InternalServerError())
        }
      }
    }

    return res.status(400).json(new errors.BadRequest())
  },

  async remove(
    req: Request<object, object, { favorite: Favorite }>,
    res: Response<RiderFavorite | HttpError<500> | HttpError<400>>
  ) {
    const { favorite } = req.body

    if (favorite && typeof favorite === 'object' && req.session?.userId) {
      const { agency, route, stop } = favorite
      const { userId } = req.session

      if (agency.id && route.id && stop.id) {
        try {
          const removed = await removeRiderFavorite(userId, favorite)

          debug('removed rider favorite', removed)
          /**
           * Guard against returning `undefined`
           * if `removed` is an empty array because
           * no rows were actually deleted.
           */
          return res.json(removed[0] ?? null)
        } catch (err) {
          if (err instanceof Error) {
            logger.error({ ...err, userId, favorite }, 'Error removing rider favorite.')
          }

          return res.status(500).json(new errors.InternalServerError())
        }
      }
    }

    return res.status(400).json(new errors.BadRequest())
  },

  async list(
    req: Request,
    res: Response<RiderFavoriteItem[] | HttpError<500> | HttpError<400>>
  ) {
    if (req.session?.userId) {
      const { userId } = req.session

      try {
        const favorites = await getRiderFavorites(userId)

        return res.json(
          favorites.map(fav => ({
            created: fav.created,
            rank: fav.rank,
            favoriteId: fav.favorite_id,
            favorite: fav.ui
          }))
        )
      } catch (err) {
        if (err instanceof Error) {
          logger.error({ ...err, userId }, 'Error getting rider favorites.')
        }

        return res.status(500).json(new errors.InternalServerError())
      }
    }

    return res.status(400).json(new errors.BadRequest())
  }
}

export { favorite }
