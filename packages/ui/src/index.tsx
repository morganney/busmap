import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './router.js'

const rootEl = document.querySelector('main') as HTMLElement
const root = createRoot(rootEl)

root.render(<RouterProvider router={router} />)
