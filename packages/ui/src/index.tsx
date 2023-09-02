import { createRoot } from 'react-dom/client'

import { BusMap } from './app.js'

const root = createRoot(document.querySelector('main') as HTMLElement)

root.render(<BusMap />)
