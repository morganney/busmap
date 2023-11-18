import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { map as lMap, popup, layerGroup, tileLayer, control } from 'leaflet'

import { VEHICLE_PANE } from './common.js'

import { useGlobals } from '../globals.js'
import { useMapDispatch } from '../contexts/map.js'

import type { Map, LayerGroup } from 'leaflet'

const useInitMap = () => {
  const { dispatch } = useGlobals()
  const mapDispatch = useMapDispatch()
  const [map, setMap] = useState<Map | null>(null)
  const mapNode = useRef(document.createElement('div'))
  const selectionRef = useRef(document.createElement('div'))
  const popupRef = useRef(popup({ minWidth: 200 }))
  const mapRef = useRef<Map>()
  const routeLayerRef = useRef<LayerGroup>(layerGroup())
  const vehiclesLayerRef = useRef<LayerGroup>(layerGroup())
  const predVehLayerRef = useRef<LayerGroup>(layerGroup())

  useLayoutEffect(() => {
    const main = document.querySelector('main')

    if (main) {
      mapNode.current.id = 'map'
      main.appendChild(mapNode.current)
    }
  }, [])

  useEffect(() => {
    mapRef.current = lMap(mapNode.current, {
      zoomControl: false
    })
    mapRef.current.createPane(VEHICLE_PANE).style.zIndex = '650'
    popupRef.current.setContent(selectionRef.current)
    popupRef.current.on('remove', () => {
      dispatch({ type: 'selected', value: undefined })
    })
    control.zoom({ position: 'bottomright' }).addTo(mapRef.current)
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapRef.current)
    routeLayerRef.current.addTo(mapRef.current)
    vehiclesLayerRef.current.addTo(mapRef.current)
    predVehLayerRef.current.addTo(mapRef.current)
    setMap(mapRef.current)

    return () => {
      mapRef.current?.remove()
    }
  }, [dispatch])

  useEffect(() => {
    if (map) {
      mapDispatch({ type: 'set', value: map })
    }
  }, [mapDispatch, map])

  return {
    map,
    popup: popupRef.current,
    selectionNode: selectionRef.current,
    routeLayer: routeLayerRef.current,
    vehiclesLayer: vehiclesLayerRef.current,
    predVehLayer: predVehLayerRef.current
  }
}

export { useInitMap }
