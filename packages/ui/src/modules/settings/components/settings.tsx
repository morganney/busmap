import styled from 'styled-components'
import { useEffect, useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@busmap/components/toast'
import { Tabs, TabList, Tab, TabPanel } from '@busmap/components/tabs'
import { PB50T, PB90T } from '@busmap/components/colors'

import { useGlobals } from '@core/globals.js'
import { usePrevious } from '@core/hooks/usePrevious.js'
import { Page } from '@core/components/page.js'

import { ThemeSettings } from './theme.js'
import { VehicleSettings } from './vehicle.js'
import { PredictionsSettings } from './predictions.js'

import { put } from '../api/put.js'
import { useSettings } from '../contexts/settings.js'

import type { FC } from 'react'
import type { RiderSettings } from '@busmap/common/types/settings'

const SettingsTabs = styled(Tabs)`
  button {
    text-align: right;
  }
`
const Settings: FC = () => {
  const { user } = useGlobals()
  // Prevents saving settins on sign in
  const userSignedIn = useRef(Boolean(user))
  const settings = useSettings()
  const prevSettings = usePrevious(settings)
  const mutation = useMutation({
    mutationFn: (sets: RiderSettings) => put(sets)
  })
  const putSettings = useCallback(
    async (payload: RiderSettings) => {
      try {
        await mutation.mutateAsync(payload)
        toast({ type: 'info', message: 'Settings saved.' })
      } catch {
        toast({ type: 'error', message: 'Error saving settings.' })
      }
    },
    [mutation]
  )
  const mode = settings.theme.mode
  const background = mode === 'dark' ? PB50T : undefined
  const color = mode === 'dark' ? PB90T : undefined

  /**
   * Performing settings API updates here in lieu
   * of inside individual event handlers within the
   * various settings components.
   */
  useEffect(() => {
    if (settings !== prevSettings && userSignedIn.current) {
      /**
       * The mismatch between the localStorage keys and the
       * settings context names are preventing a dynamic
       * approach using a config object/map.
       *
       * Consider making the keys consistent, and/or
       * whether settings should just read from the storage context.
       *
       * predictions --> preds
       * markPredictedVehicles --> colorPredicted
       */
      const payload: RiderSettings = {
        themeMode: settings.theme.mode,
        predsFormat: settings.predictions.format,
        predsPersistentOverlay: settings.predictions.persistentOverlay,
        vehicleVisible: settings.vehicle.visible,
        vehicleSpeedUnit: settings.vehicle.speedUnit,
        vehicleColorPredicted: settings.vehicle.markPredictedVehicles
      }

      putSettings(payload)
    }
  }, [settings, prevSettings, putSettings])

  useEffect(() => {
    userSignedIn.current = Boolean(user)
  }, [user])

  return (
    <Page title="Settings">
      <SettingsTabs
        initialTab="vehicle"
        direction="column"
        fontSize="12px"
        gap="16px"
        background={background}
        color={color}>
        <TabList>
          <Tab name="vehicle">Vehicle</Tab>
          <Tab name="predictions">Predictions</Tab>
          <Tab name="theme">Theme</Tab>
        </TabList>
        <TabPanel name="vehicle">
          <VehicleSettings />
        </TabPanel>
        <TabPanel name="predictions">
          <PredictionsSettings />
        </TabPanel>
        <TabPanel name="theme">
          <ThemeSettings />
        </TabPanel>
      </SettingsTabs>
    </Page>
  )
}

export { Settings }
