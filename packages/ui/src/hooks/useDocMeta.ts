import { useEffect, useRef } from 'react'

import { useGlobals } from '../globals.js'
import { usePredictions } from '../contexts/predictions'

const useDocMeta = () => {
  const metaDesc = useRef<Element>()
  const { agency, stop } = useGlobals()
  const { predictions } = usePredictions()

  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]')

    if (meta) {
      metaDesc.current = meta
    }
  }, [])

  useEffect(() => {
    if (metaDesc.current) {
      if (agency && stop) {
        let event = 'arrival'
        let title = `${stop.title}`

        if (predictions.length) {
          const [one, two] = predictions[0].values

          if (one.isDeparture) {
            event = 'departure'
          }

          title += `: ${one.minutes || 'Now'}`

          if (two) {
            title += ` & ${two.minutes || 'Now'}`
          }

          title += ' min'
        }

        document.title = title
        metaDesc.current.setAttribute(
          'content',
          `Maps providing real-time ${event} times of vehicles for ${agency.title} stop ${stop.title}.`
        )
      } else {
        document.title =
          'Busmap - Stop and vehicle locations of popular transit agencies.'
        metaDesc.current.setAttribute(
          'content',
          'Maps providing real-time arrival and departure times of vehicles for bus stops along routes in San Francisco Muni CIS, Toronto Transit Commission, OmniTrans and other transit agencies across North and South America.'
        )
      }
    }
  }, [agency, stop, predictions])
}

export { useDocMeta }
