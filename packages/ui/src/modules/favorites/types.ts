import type { Agency, RouteName, DirectionName, Stop, Prediction } from '../../types.js'

interface Favorite {
  agency: Omit<Agency, 'region'>
  route: RouteName
  direction: DirectionName
  stop: Stop
}
type FavoriteGroup = Record<string, Favorite[]>
type AgencyRouteFavoritesGroup = Record<
  Agency['title'],
  Record<RouteName['title'], Favorite[]>
>
type PredictionsMap = Record<string, Prediction[] | undefined>
interface WorkerMessage {
  error?: Error
  predictionsMap: PredictionsMap
}
interface ThreadMessage {
  action: 'update' | 'close'
  favoritesByAgencyId?: FavoriteGroup
}

export type {
  Favorite,
  AgencyRouteFavoritesGroup,
  PredictionsMap,
  WorkerMessage,
  ThreadMessage
}
