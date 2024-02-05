import { lazy } from 'react'
import { createBrowserRouter, useRouteError } from 'react-router-dom'

import { Root } from './root.js'
import { Providers } from './providers.js'
import { ErrorBoundary } from './components/error/boundary.js'
import { NotFound } from './components/error/notFound.js'

/**
 * Required until RR allows errors to bubble up outside
 * of the <RouterProvider />
 *
 * @see https://github.com/remix-run/react-router/issues/10257
 */
const ErrorElement = () => {
  const error = useRouteError()

  if (error instanceof Error) {
    return <ErrorBoundary error={error} />
  }

  return <ErrorBoundary error={new Error('An unknown error occured.')} />
}
const Home = lazy(() => import('./components/home.js'))
const router = createBrowserRouter([
  {
    id: 'root',
    element: <Root />,
    errorElement: <ErrorElement />,
    children: [
      {
        id: 'home',
        path: '/',
        element: <Home />,
        children: [
          {
            id: 'home-stop',
            path: 'stop/:agency?/:route?/:direction?/:stop?',
            element: <Home />
          }
        ]
      }
    ]
  },
  {
    id: 'not-found',
    path: '*',
    element: (
      <Providers>
        <NotFound />
      </Providers>
    )
  }
])

export { router }
