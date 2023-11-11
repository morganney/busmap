import { ROOT } from './common.js'

import { transport } from '../transport.js'
import { errors } from '../errors.js'

import type { Route, RouteName } from '../../types.js'

const getAll = async (agencyId?: string) => {
  if (!agencyId) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  const routes = await transport.fetch<RouteName[]>(`${ROOT}/agencies/${agencyId}/routes`)

  routes.forEach(route => {
    delete route._links
  })

  return routes
}
const get = async (agencyId?: string, routeId?: string) => {
  if (!agencyId || !routeId) {
    throw errors.create('GET', 400, 'Bad Request')
  }

  const route = await transport.fetch<Route>(
    `${ROOT}/agencies/${agencyId}/routes/${routeId}`
  )

  delete route._links

  return route
}

export { get, getAll }
