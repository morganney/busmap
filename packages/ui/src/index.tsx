import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './router.js'

import 'leaflet/dist/leaflet.css'

const rootEl = document.querySelector('main') as HTMLElement
const root = createRoot(rootEl)

root.render(<RouterProvider router={router} />)
