import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import { BusMap } from './app.js'

const root = createRoot(document.querySelector('main') as HTMLElement)

root.render(
  <StrictMode>
    <BusMap />
  </StrictMode>
)
