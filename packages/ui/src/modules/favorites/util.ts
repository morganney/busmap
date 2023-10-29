import type { Favorite } from './types.js'

const same = (a: Favorite, b: Favorite): boolean => {
  const comboA = `${a.route.id}${a.direction.id}${a.stop.id}`
  const comboB = `${b.route.id}${b.direction.id}${b.stop.id}`

  return comboA === comboB
}
const groupBy = <T>(list: T[], callback: (item: T) => string): Record<string, T[]> => {
  const groups: Record<string, T[]> = {}

  if (Array.isArray(list)) {
    list.forEach(item => {
      const key = callback(item)

      if (!Array.isArray(groups[key])) {
        groups[key] = []
      }

      groups[key].push(item)
    })
  }

  return groups
}
const getPredsKey = (agencyTitle: string, routeTitle: string, stopId: string) => {
  return `${agencyTitle}::${routeTitle}::${stopId}`
}

export { same, groupBy, getPredsKey }
