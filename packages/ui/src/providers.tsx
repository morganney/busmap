import { QueryClientProvider } from '@tanstack/react-query'

import { GlobalsProvider } from './globals.js'
import { MapProvider } from './contexts/map.js'
import { StorageProvider } from './contexts/storage.js'
import { VehiclesProvider } from './contexts/vehicles.js'
import { PredictionsProvider } from './contexts/predictions.js'
import { LocationProvider } from './modules/location/contexts/location.js'
import { SettingsProvider } from './modules/settings/contexts/settings.js'
import { queryClient } from './queryClient.js'

import type { FC, ReactNode } from 'react'

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StorageProvider>
        <GlobalsProvider>
          <MapProvider>
            <LocationProvider>
              <SettingsProvider>
                <VehiclesProvider>
                  <PredictionsProvider>{children}</PredictionsProvider>
                </VehiclesProvider>
              </SettingsProvider>
            </LocationProvider>
          </MapProvider>
        </GlobalsProvider>
      </StorageProvider>
    </QueryClientProvider>
  )
}

export { Providers }
