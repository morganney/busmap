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
        element: <Home />,
        children: [
          {
            id: 'home-stop',
            path: 'stop/:agency/:route/:direction/:stop',
            element: <Home />
          },
          {
            id: 'home-direction',
            path: 'stop/:agency/:route/:direction',
            element: <Home />
          }
        ]
      }
    ]
  }
])

export { router }
