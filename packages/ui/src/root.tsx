import { Outlet } from 'react-router-dom'

import { Layout } from './layout.js'
import { ErrorBoundary } from './components/errorBoundary.js'

const Root = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  )
}

export { Root }
