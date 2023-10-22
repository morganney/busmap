import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster, toast } from '@busmap/components/toast'

import { Layout } from './layout.js'
import { ErrorBoundary } from './components/errorBoundary.js'
import { useTheme } from './contexts/settings/theme.js'

// TODO: Should fetch agencies here and set it in context
const Root = () => {
  const { mode, dispatch } = useTheme()
  const location = useLocation()

  useEffect(() => {
    toast({ open: false })
  }, [location])

  useEffect(() => {
    document.body.classList.remove('busmap-light', 'busmap-dark')
    document.body.classList.add(`busmap-${mode}`)
  }, [mode])

  useEffect(() => {
    const onChangePrefersColorScheme = (evt: MediaQueryListEvent) => {
      dispatch({
        type: 'mode',
        value: evt.matches ? 'dark' : 'light'
      })
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)')

    mql.addEventListener('change', onChangePrefersColorScheme)

    return () => {
      mql.removeEventListener('change', onChangePrefersColorScheme)
    }
  }, [dispatch])

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
