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

// API models

interface RiderFavoriteListItem {
  created: string
  rank: number
  agency_id: string
  route_id: string
  stop_id: string
  favorte_id: number
  ui: string
}

export type { RouteMeta, Favorite, RiderFavoriteListItem }
