import type { Favorite } from '@busmap/common/types/favorites'
import type { Agency, RouteName } from '@core/types.js'
import type { Prediction } from '@core/contexts/predictions.js'

type FavoriteGroup = Record<string, Favorite[]>
type AgencyRouteFavoritesGroup = Record<
  Agency['title'],
  Record<RouteName['title'], Favorite[]>
>
type PredictionsMap = Record<string, Prediction[] | undefined>
// Maps agencyId to the associated PromiseRejectedResult.reason from Promise.allSettled.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrorsMap = Record<string, any>
interface WorkerMessage {
  error?: Error
  errors: ErrorsMap
  predictions: PredictionsMap
}
interface ThreadMessage {
  action: 'update' | 'stop' | 'close' | 'restart'
  favoritesByAgencyId?: FavoriteGroup
}

export type {
  Favorite,
  AgencyRouteFavoritesGroup,
  PredictionsMap,
  WorkerMessage,
  ThreadMessage,
  ErrorsMap
}
