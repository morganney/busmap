import { ROOT } from './common.js'

import { transport } from '../transport.js'

import type { Agency, AgencyName } from '../../types.js'

const get = async (id: string) => {
  const agency = await transport.fetch<Agency>(`${ROOT}/agencies/${id}`)

  return agency
}
const getAll = async () => {
  const agencies = await transport.fetch<AgencyName[]>(`${ROOT}/agencies`)

  return agencies
}

export { get, getAll }
