import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'

import type { Map, LayerGroup } from 'leaflet'
import type { BusmapAction } from '../types.js'

const useInitMap = (dispatch: (value: BusmapAction) => void) => {
  const [map, setMap] = useState<Map | null>(null)
  const selectionRef = useRef(document.createElement('div'))
  const popupRef = useRef(L.popup())
  const mapRef = useRef<Map>()
  const routeLayerRef = useRef<LayerGroup>(L.layerGroup())
  const predVehLayerRef = useRef<LayerGroup>(L.layerGroup())

  useEffect(() => {
    mapRef.current = L.map(document.querySelector('main') as HTMLElement)
    popupRef.current.setContent(selectionRef.current)
    popupRef.current.on('remove', () => {
      dispatch({ type: 'selected', value: undefined })
    })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapRef.current)
    routeLayerRef.current.addTo(mapRef.current)
    predVehLayerRef.current.addTo(mapRef.current)
    setMap(mapRef.current)

    return () => {
      mapRef.current?.remove()
    }
  }, [dispatch])

  return {
    map,
    popup: popupRef.current,
    selectionNode: selectionRef.current,
    routeLayer: routeLayerRef.current,
    predVehLayer: predVehLayerRef.current
  }
}

export { useInitMap }
