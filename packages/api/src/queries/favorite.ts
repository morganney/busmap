import { sql } from '../db.js'

import type { Favorite } from '@busmap/common/types/favorites'
import type { RiderFavorite } from '../types.js'

const addRiderFavorite = async (favorite: Favorite, userId: number) => {
  const { agency, route, stop } = favorite
  const riderFavoriteRow = await sql<RiderFavorite[]>`
    WITH
      data (agency_id, route_id, stop_id, ui)
    AS (
      VALUES (${agency.id}, ${route.id}, ${stop.id}, ${JSON.stringify(favorite)}::jsonb)
    ),
      inserted
    AS (
      INSERT INTO favorite
        (agency_id, route_id, stop_id, ui)
      SELECT * FROM data
      ON CONFLICT
        (agency_id, route_id, stop_id)
      DO NOTHING
      RETURNING
        id as favorite_id
    )
    INSERT INTO rider_favorite
      (rider, favorite)
    SELECT ${userId}::integer, favorite_id FROM inserted
    UNION ALL
    SELECT ${userId}::integer, favorite.id FROM data
    JOIN favorite USING (agency_id, route_id, stop_id)
    ON CONFLICT
      (rider, favorite)
    DO NOTHING
    RETURNING
      created
  `

  return riderFavoriteRow
}

export { addRiderFavorite }
