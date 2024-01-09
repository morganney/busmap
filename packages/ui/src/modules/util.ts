import { Agency, RouteName, DirectionName, Stop, Page } from '@core/types.js'

interface Selection {
  agency: Agency
  route: RouteName
  direction: DirectionName
  stop: Stop
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
const same = (a: Selection, b: Selection): boolean => {
  const comboA = `${a.agency.id}${a.route.id}${a.direction.id}${a.stop.id}`
  const comboB = `${a.agency.id}${b.route.id}${b.direction.id}${b.stop.id}`

  return comboA === comboB
}

const isAPage = (x: unknown): x is Page => {
  if (
    x &&
    typeof x === 'string' &&
    [
      'locate',
      'favorites',
      'select',
      'settings',
      'info',
      'signin',
      'profile',
      'busmap'
    ].includes(x)
  ) {
    return true
  }

  return false
}

export { groupBy, same, isAPage }
export type { Selection }
