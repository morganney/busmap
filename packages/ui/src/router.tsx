import { createBrowserRouter } from 'react-router-dom'

import { Root } from './root.js'
import { Home } from './home.js'

const router = createBrowserRouter([
  {
    id: 'root',
    element: <Root />,
    children: [
      {
        id: 'home',
        path: '/',
        element: <Home />
      },
      {
        id: 'home-bus',
        path: '/bus/:agency?/:route?/:direction?/:stop?',
        element: <Home />
      }
    ]
  }
])

export { router }