import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'

import { GlobalsProvider } from './globals.js'
import { VehiclesProvider } from './contexts/vehicles.js'
import { SettingsProvider } from './contexts/settings/index.js'
import { router } from './router.js'

import type { FC } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})
const BusMap: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalsProvider>
        <SettingsProvider>
          <VehiclesProvider>
            <RouterProvider router={router} />
          </VehiclesProvider>
        </SettingsProvider>
      </GlobalsProvider>
    </QueryClientProvider>
  )
}

export { BusMap }
