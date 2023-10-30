import type {
  Agency,
  RouteName,
  Route,
  DirectionName,
  Stop,
  Prediction
} from '../../types.js'

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
  action: 'update' | 'stop' | 'close'
  favoritesByAgencyId?: FavoriteGroup
}

export type {
  Favorite,
  AgencyRouteFavoritesGroup,
  PredictionsMap,
  WorkerMessage,
  ThreadMessage
}
