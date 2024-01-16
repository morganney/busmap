import { env } from 'node:process'

import postgres from 'postgres'

import { logger } from './logger.js'

/**
 * @see https://aws.github.io/copilot-cli/docs/developing/storage/
 */
interface AuroraCluster {
  host: string
  port: string
  dbname: string
  username: string
  password: string
  dbClusterIdentifier: string
  engine: string
}

let host = env.POSTGRES_HOST ?? 'db'
let port = env.POSTGRES_PORT ?? '5432'
let database = env.POSTGRES_DB
let username = env.POSTGRES_USER
let password = env.POSTGRES_PASSWORD

/**
 * Check for environment variable injected by AWS copilot.
 */
if (env.BMCLUSTER_SECRET) {
  const secrets = JSON.parse(env.BMCLUSTER_SECRET) as AuroraCluster

  host = secrets.host
  port = secrets.port
  database = secrets.dbname
  username = secrets.username
  password = secrets.password
}

const sql = postgres({
  host,
  database,
  username,
  password,
  port: Number(port),
  /**
   * Sets db connections.
   * @see https://github.com/porsager/postgres/issues/369#issuecomment-1129580233
   */
  max: 5,
  /**
   * Not sure if the same as what is in this doc.
   * @see https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-IDLE-SESSION-TIMEOUT
   */
  idle_timeout: 5
})

logger.info({ host: host, port: port, name: database }, 'Database connected.')

export { sql }
