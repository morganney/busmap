import { useState, useEffect, StrictMode, lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@busmap/components/toast'

import { authn } from './channels.js'
import { status } from './api/authn.js'
import { Providers } from './providers.js'
import { Navigation } from './components/navigation.js'
import { Loading } from './components/loading.js'

import type { Status } from './types.js'

const Layout = lazy(() => import('./layout.js'))
const Root = () => {
  const [authStatus, setAuthStatus] = useState<Status>()

  useEffect(() => {
    const fetchStatus = async () => {
      const statusResults = await status()

      setAuthStatus(statusResults)
    }

    fetchStatus()

    return () => {
      authn.close()
    }
  }, [])

  if (!status) {
    // TODO show better UI/UX
    return null
  }

  return (
    <StrictMode>
      <Providers>
        <Toaster anchor="top right" />
        <Navigation status={authStatus} />
        <Suspense fallback={<Loading text="Loading" />}>
          <Layout>
            <Outlet />
          </Layout>
        </Suspense>
      </Providers>
    </StrictMode>
  )
}

export { Root }
