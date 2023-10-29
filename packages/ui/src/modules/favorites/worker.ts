import { groupBy, getPredsKey } from './util.js'

import { getForTuples } from '../../api/rb/tuples.js'

import type { ThreadMessage } from './types.js'

interface TupleRequest {
  agencyId: string
  tuples: string[]
}

let timeout: ReturnType<typeof setTimeout>

async function recurse(requests: TupleRequest[]) {
  try {
    const preds = await Promise.all(
      requests.map(({ agencyId, tuples }) => getForTuples(agencyId, tuples))
    )
    const predictionsMap = groupBy(preds.flat(), pred =>
      getPredsKey(pred.agency.title, pred.route.title, pred.stop.id)
    )

    postMessage({ error: undefined, predictionsMap })
    timeout = setTimeout(() => {
      recurse(requests)
    }, 10_000)
  } catch (err) {
    postMessage(err)
    clearTimeout(timeout)
  }
}

addEventListener('message', (evt: MessageEvent<ThreadMessage>) => {
  const { action, favoritesByAgencyId } = evt.data

  if (action === 'update' && favoritesByAgencyId) {
    const requests: TupleRequest[] = []

    for (const [agencyId, favs] of Object.entries(favoritesByAgencyId)) {
      const tuples: string[] = []

      favs.forEach(fav => {
        // Restbus tuple is <routeId>:<stopId>
        tuples.push(`${fav.route.id}:${fav.stop.id}`)
      })

      requests.push({ agencyId, tuples })
    }

    clearTimeout(timeout)
    recurse(requests)
  }

  if (action === 'close') {
    postMessage(`Worker ${self.name} is closing...`)
    self.close()
  }
})
