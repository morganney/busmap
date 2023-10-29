import styled from 'styled-components'
import { useEffect, useState, useMemo, memo } from 'react'

import { useStorage } from '../../../contexts/storage.js'
import { groupBy, getPredsKey } from '../util.js'

import type {
  WorkerMessage,
  PredictionsMap,
  AgencyRouteFavoritesGroup
} from '../types.js'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h2 {
    font-size: 22px;
    margin: 0;
  }

  h3 {
    font-size: 12px;
    font-weight: normal;
    margin: 0;
  }

  h4 {
    font-size: 12px;
    font-weight: normal;
    margin: 0;
  }
`
const AgencySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const RouteSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const Article = styled.article`
  h5 {
    font-size: 16px;
    margin: 0;
  }

  h6 {
    font-size: 12px;
    font-weight: normal;
    margin: 0;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: 4px;
  }
`
const worker = new Worker(new URL('../worker.ts', import.meta.url), {
  type: 'module',
  name: 'favorites'
})
const Favorites = memo(function Favorites() {
  const { favorites } = useStorage()
  const [predictionsMap, setPredictionsMap] = useState<PredictionsMap>({})
  const agencyRouteGroup = useMemo(() => {
    const outer: AgencyRouteFavoritesGroup = {}

    if (favorites) {
      const inner = groupBy(favorites, fav => fav.agency.title)

      Object.keys(inner).forEach(agency => {
        outer[agency] = groupBy(inner[agency], fav => fav.route.title)
      })
    }

    return outer
  }, [favorites])

  useEffect(() => {
    worker.addEventListener('message', (evt: MessageEvent<WorkerMessage>) => {
      if (!evt.data.error) {
        setPredictionsMap(evt.data.predictionsMap)
      }
    })
  }, [])

  useEffect(() => {
    if (favorites) {
      worker.postMessage({
        action: 'update',
        favoritesByAgencyId: groupBy(favorites, ({ agency }) => agency.id)
      })
    }
  }, [favorites])

  return (
    <Section>
      <h2>Favorite Stops</h2>
      {!favorites.length ? (
        <div>⭐ You can select your favorite stops from the bus selector tab. ⭐</div>
      ) : (
        Object.keys(agencyRouteGroup).map(agencyTitle => (
          <AgencySection key={agencyTitle}>
            <h3>{agencyTitle}</h3>
            {Object.keys(agencyRouteGroup[agencyTitle]).map(routeTitle => (
              <RouteSection key={routeTitle}>
                <h4>{routeTitle}</h4>
                {agencyRouteGroup[agencyTitle][routeTitle].map((fav, idx) => {
                  const preds =
                    predictionsMap[getPredsKey(agencyTitle, routeTitle, fav.stop.id)]

                  return (
                    <Article key={`${fav.stop.id}-${idx}`}>
                      <header>
                        <h5>{fav.stop.title}</h5>
                        <h6>{fav.direction.title}</h6>
                      </header>
                      {preds?.length ? (
                        <ul>
                          {preds[0].values
                            .slice(0, 3)
                            .map(({ vehicle, epochTime, minutes }) => (
                              <li key={`${epochTime}-${vehicle.id}`}>{minutes}</li>
                            ))}
                        </ul>
                      ) : (
                        <span>No predictions.</span>
                      )}
                    </Article>
                  )
                })}
              </RouteSection>
            ))}
          </AgencySection>
        ))
      )}
    </Section>
  )
})

export { Favorites }
