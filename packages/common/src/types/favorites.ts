import type { RouteName, Route, Agency, DirectionName, Stop } from './restbus.js'

interface RouteMeta extends RouteName {
  color: Route['color']
  textColor: Route['textColor']
}
interface Favorite {
  agency: Agency
  route: RouteMeta
  direction: DirectionName
  stop: Stop
}

export type { RouteMeta, Favorite }
