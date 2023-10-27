import type { Agency, RouteName, DirectionName, Stop } from '../../types.js'

interface Favorite {
  agency: Agency
  route: RouteName
  direction: DirectionName
  stop: Stop
}

export type { Favorite }
