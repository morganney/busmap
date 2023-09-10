import L from 'leaflet'
import { useEffect, useContext } from 'react'

import { Globals } from './globals.js'

import type { FC, ReactNode } from 'react'

export interface LayoutProps {
  children: ReactNode
}
export const Layout: FC<LayoutProps> = ({ children }) => {
  const { bounds, route } = useContext(Globals)

  useEffect(() => {
    const main = document.querySelector('main') as HTMLElement
    const map = L.map(main)
    const bnds = route?.bounds ?? bounds

    L.latLngBounds(L.latLng(bnds.sw.lat, bnds.sw.lon), L.latLng(bnds.ne.lat, bnds.ne.lon))
    map.fitBounds(
      L.latLngBounds(
        L.latLng(bnds.sw.lat, bnds.sw.lon),
        L.latLng(bnds.ne.lat, bnds.ne.lon)
      )
    )
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    return () => {
      map.remove()
    }
  }, [bounds, route])

  return children
}
