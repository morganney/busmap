import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Icon } from 'leaflet'

import { router } from './router.js'

import 'leaflet/dist/leaflet.css'

const rootEl = document.querySelector('main') as HTMLElement
const root = createRoot(rootEl)

Icon.Default.prototype.options.iconUrl =
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
Icon.Default.prototype.options.iconRetinaUrl =
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'
Icon.Default.prototype.options.shadowUrl =
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

root.render(<RouterProvider router={router} />)
