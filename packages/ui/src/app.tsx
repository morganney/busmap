import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { GlobalsProvider } from './globals.js'
import { MapProvider } from './contexts/map.js'
import { StorageProvider } from './contexts/storage.js'
import { VehiclesProvider } from './contexts/vehicles.js'
import { SettingsProvider } from './modules/settings/contexts/settings.js'
import { router } from './router.js'
import { queryClient } from './queryClient.js'

import type { FC } from 'react'

const BusMap: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StorageProvider>
        <GlobalsProvider>
          <MapProvider>
            <SettingsProvider>
              <VehiclesProvider>
                <RouterProvider router={router} />
              </VehiclesProvider>
            </SettingsProvider>
          </MapProvider>
        </GlobalsProvider>
      </StorageProvider>
    </QueryClientProvider>
  )
}

export { BusMap }
