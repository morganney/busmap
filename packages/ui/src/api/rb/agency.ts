import { ROOT, modifyMuniTitle } from './common.js'

import { transport } from '../transport.js'

import type { Agency } from '../../types.js'

const modify = (agency: Agency) => {
  modifyMuniTitle(agency)
}
const get = async (id: string) => {
  const agency = await transport.fetch<Agency>(`${ROOT}/agencies/${id}?links=false`)

  modify(agency)

  return agency
}
const getAll = async () => {
  const agencies = await transport.fetch<Agency[]>(`${ROOT}/agencies?links=false`)

  agencies.forEach(agency => {
    modify(agency)
  })

  return agencies
}

export { get, getAll }
