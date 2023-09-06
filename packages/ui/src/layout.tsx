import L from 'leaflet'
import { useEffect } from 'react'

import type { FC, ReactNode } from 'react'

export interface LayoutProps {
  children: ReactNode
}
export const Layout: FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    const main = document.querySelector('main') as HTMLElement
    const map = L.map(main, {
      center: [32.79578, -95.45166],
      zoom: 13
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    return () => {
      map.remove()
    }
  }, [])

  return children
}
