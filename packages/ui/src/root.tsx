import { useState, useEffect, StrictMode } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@busmap/components/toast'

import { authn } from './channels.js'
import { status as getStatus } from './api/authn.js'
import { Layout } from './layout.js'
import { Providers } from './providers.js'
import { Navigation } from './components/navigation.js'

import type { Status } from './types.js'

const Root = () => {
  const [status, setStatus] = useState<Status>()

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getStatus()

      setStatus(status)
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
        <Navigation status={status} />
        <Layout>
          <Outlet />
        </Layout>
      </Providers>
    </StrictMode>
  )
}

export { Root }
