import type { Favorite } from './types.js'

const same = (a: Favorite, b: Favorite): boolean => {
  const comboA = `${a.route.id}${a.direction.id}${a.stop.id}`
  const comboB = `${b.route.id}${b.direction.id}${b.stop.id}`

  return comboA === comboB
}
const getPredsKey = (agencyTitle: string, routeTitle: string, stopId: string) => {
  return `${agencyTitle}::${routeTitle}::${stopId}`
}

export { same, getPredsKey }
