import { Outlet } from 'react-router-dom'
import { Toaster } from '@busmap/components/toast'

import { Layout } from './layout.js'
import { Providers } from './providers.js'

const Root = () => {
  return (
    <Providers>
      <Toaster anchor="bottom left" />
      <Layout>
        <Outlet />
      </Layout>
    </Providers>
  )
}

export { Root }
