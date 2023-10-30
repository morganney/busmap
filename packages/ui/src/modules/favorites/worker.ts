import debounce from 'lodash.debounce'

import { groupBy, getPredsKey } from './util.js'

import { getForTuples } from '../../api/rb/tuples.js'

import type { ThreadMessage } from './types.js'

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
      const preds = await Promise.all(
        tupleRequests.map(({ agencyId, tuples }) =>
          getForTuples(agencyId, tuples, controller.signal)
        )
      )
      const predictionsMap = groupBy(preds.flat(), pred =>
        getPredsKey(pred.agency.title, pred.route.title, pred.stop.id)
      )

      postMessage({ error: undefined, predictionsMap })
      timeToNextFetch = timeSinceLastFetch + INTERVAL
    } catch (err) {
      cancelAnimationFrame(timeoutId)
      timeToNextFetch = 0

      if (err instanceof Error && err.name !== 'AbortError') {
        postMessage({ error: err })
      }
    }
  }

  timeoutId = requestAnimationFrame(getFavoritePreds)
}
const restartFavoritesPoll = debounce(
  () => {
    controller = new AbortController()
    timeoutId = requestAnimationFrame(getFavoritePreds)
  },
  350,
  { leading: true, trailing: false }
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
    tupleRequests = []
    timeToNextFetch = 0
  }

  if (action === 'close') {
    controller.abort()
    cancelAnimationFrame(timeoutId)
    postMessage(`Worker ${self.name} is closing...`)
    self.close()
  }
})
