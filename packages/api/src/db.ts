import { env } from 'node:process'

import postgres from 'postgres'

const sql = postgres({
  host: 'db',
  port: 5432,
  /**
   * Sets db connections.
   * @see https://github.com/porsager/postgres/issues/369#issuecomment-1129580233
   */
  max: 5,
  /**
   * Not sure if the same as what is in this doc.
   * @see https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-IDLE-SESSION-TIMEOUT
   */
  idle_timeout: 0,
  database: env.POSTGRES_DB,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD
})

export { sql }
