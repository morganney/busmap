import { createBrowserRouter } from 'react-router-dom'

import { Root } from './root.js'
import { Home } from './home.js'
import { queryClient } from './queryClient.js'
import { getAll } from './api/rb/agency.js'

const rootLoader = () => {
  return queryClient.fetchQuery({
    queryKey: ['agencies'],
    queryFn: getAll,
    staleTime: 10 * 60 * 1000
  })
}

const router = createBrowserRouter([
  {
    id: 'root',
    element: <Root />,
    loader: rootLoader,
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
          }
        ]
      }
    ]
  }
])

export { router }
