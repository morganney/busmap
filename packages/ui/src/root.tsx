import { Outlet } from 'react-router-dom'
import { Toaster } from '@busmap/components/toast'

import { Layout } from './layout.js'
import { ErrorBoundary } from './components/errorBoundary.js'

// TODO: Should fetch agencies here and set it in context
const Root = () => {
  return (
    <ErrorBoundary>
      <Toaster anchor="top left" />
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  )
}

export { Root }
