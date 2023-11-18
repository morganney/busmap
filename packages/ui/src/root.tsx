import { Outlet } from 'react-router-dom'
import { Toaster } from '@busmap/components/toast'

import { Layout } from './layout.js'
import { Providers } from './providers.js'
import { Navigation } from './components/navigation.js'

const Root = () => {
  return (
    <Providers>
      <Toaster anchor="top right" />
      <Navigation />
      <Layout>
        <Outlet />
      </Layout>
    </Providers>
  )
}

export { Root }
