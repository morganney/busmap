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

interface RiderFavorite {
  rider: number
  favorite: number
  rank: number
  created: string
}
interface RiderFavoriteRow {
  created: string
  rank: number
  agency_id: string
  route_id: string
  stop_id: string
  favorite_id: number
  ui: Favorite
}
interface RiderFavoriteItem {
  created: string
  rank: number
  favoriteId: number
  favorite: Favorite
}

export type { RouteMeta, Favorite, RiderFavorite, RiderFavoriteRow, RiderFavoriteItem }
