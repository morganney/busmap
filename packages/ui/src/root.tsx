import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster, toast } from '@busmap/components/toast'

import { Layout } from './layout.js'
import { ErrorBoundary } from './components/errorBoundary.js'

// TODO: Should fetch agencies here and set it in context
const Root = () => {
  const location = useLocation()

  useEffect(() => {
    toast({ open: false })
  }, [location])

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
