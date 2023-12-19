import { sql } from '../db.js'

import type { RiderSettings } from '@busmap/common/types/settings'
import type { SerializableParameter } from 'postgres'
const updateRiderSettings = async (settings: RiderSettings, userId: number) => {
  const riderSettings = await sql<RiderSettings[]>`
    UPDATE rider
    SET settings = ${settings as unknown as SerializableParameter}::jsonb
    WHERE id = ${userId}::integer
    RETURNING settings
  `

  return riderSettings
}

export { updateRiderSettings }
