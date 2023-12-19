import debounce from 'lodash.debounce'

import { getForTuples } from '@core/api/rb/tuples.js'
import { groupBy } from '@module/util.js'

import { getPredsKey } from './util.js'

import type { Prediction } from '@core/types.js'
import type { ThreadMessage, ErrorsMap } from './types.js'

interface TupleRequest {
  agencyId: string
  tuples: string[]
}

const INTERVAL = 10_000
let timeToNextFetch = 0
let tupleRequests: TupleRequest[] = []
let timeoutId: ReturnType<typeof requestAnimationFrame>
let controller = new AbortController()

const getFavoritePreds = async (timeSinceLastFetch: number) => {
  if (timeToNextFetch <= timeSinceLastFetch) {
    try {
      const results = await Promise.allSettled(
        tupleRequests.map(({ agencyId, tuples }) =>
          getForTuples(agencyId, tuples, controller.signal)
        )
      )
      const successes: Prediction[][] = []
      const errors: ErrorsMap = {}

      results.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          if (result.value) {
            successes.push(result.value)
          }
        } else {
          errors[tupleRequests[idx].agencyId] = result.reason
        }
      })

      const predictions = groupBy(successes.flat(), pred =>
        getPredsKey(pred.agency.title, pred.route.title, pred.stop.id)
      )

      postMessage({
        errors,
        predictions,
        error: undefined
      })
      timeToNextFetch = timeSinceLastFetch + INTERVAL
    } catch (err) {
      cancelAnimationFrame(timeoutId)
      timeToNextFetch = timeSinceLastFetch + INTERVAL

      if (err instanceof Error && err.name !== 'AbortError') {
        postMessage({ error: err })
      }
    }
  }

  cancelAnimationFrame(timeoutId)
  timeoutId = requestAnimationFrame(getFavoritePreds)
}
const restartFavoritesPoll = debounce(
  () => {
    controller = new AbortController()
    timeoutId = requestAnimationFrame(getFavoritePreds)
  },
  350,
  { leading: false, trailing: true }
)

addEventListener('message', (evt: MessageEvent<ThreadMessage>) => {
  const { action, favoritesByAgencyId } = evt.data

  if (action === 'update' && favoritesByAgencyId) {
    const requests: TupleRequest[] = []

    for (const [agencyId, favs] of Object.entries(favoritesByAgencyId)) {
      const tuples: string[] = []

      favs.forEach(fav => {
        // Restbus API tuple is <routeId>:<stopId>
        tuples.push(`${fav.route.id}:${fav.stop.id}`)
      })

      requests.push({ agencyId, tuples })
    }

    controller.abort()
    cancelAnimationFrame(timeoutId)
    tupleRequests = requests
    timeToNextFetch = 0

    if (requests.length) {
      restartFavoritesPoll()
    }
  }

  if (action === 'stop') {
    controller.abort()
    cancelAnimationFrame(timeoutId)
    timeToNextFetch = 0
  }

  if (action === 'restart' && tupleRequests.length) {
    restartFavoritesPoll()
  }

  if (action === 'close') {
    controller.abort()
    cancelAnimationFrame(timeoutId)
    postMessage(`Worker ${self.name} is closing...`)
    self.close()
  }
})
