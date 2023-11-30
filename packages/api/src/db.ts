import { env } from 'node:process'

import postgres from 'postgres'

const sql = postgres({
  host: 'db',
  port: 5432,
  database: env.POSTGRES_DB,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD
})

export { sql }
