import { createBrowserRouter } from 'react-router-dom'

import { Root } from './root.js'
import { Home } from './home.js'

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/bus/:agency?/:route?/:direction?/:stop?',
        element: <Home />
      }
    ]
  }
])

export { router }
