import { useState, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@busmap/components/toast'

import { status as getStatus } from './api/authn.js'
import { Layout } from './layout.js'
import { Providers } from './providers.js'
import { Navigation } from './components/navigation.js'

import type { Status } from './types.js'

const Root = () => {
  const isInitialized = useRef(false)
  const [status, setStatus] = useState<Status>()

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getStatus()

      setStatus(status)
    }

    // Only here to avoid StrictMode annoyance with extra session creation
    if (!isInitialized.current) {
      isInitialized.current = true
      fetchStatus()
    }
  }, [])

  if (!status) {
    return null
  }

  return (
    <Providers>
      <Toaster anchor="top right" />
      <Navigation status={status} />
      <Layout>
        <Outlet />
      </Layout>
    </Providers>
  )
}

export { Root }
