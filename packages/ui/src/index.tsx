import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import { BusMap } from './app.js'

const rootEl = document.querySelector('main') as HTMLElement
const root = createRoot(rootEl)

root.render(
  <StrictMode>
    <BusMap />
  </StrictMode>
)
