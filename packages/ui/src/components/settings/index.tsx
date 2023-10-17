import styled from 'styled-components'
import { Tabs, TabList, Tab, TabPanel } from '@busmap/components/tabs'

import { VehicleSettings } from './vehicle.js'
import { PredictionsSettings } from './predictions.js'

import type { FC } from 'react'

const SettingsTabs = styled(Tabs)`
  button {
    text-align: right;
  }
`
const Settings: FC = () => {
  return (
    <SettingsTabs initialTab="vehicle" direction="column" fontSize="12px" gap="16px">
      <TabList>
        <Tab name="vehicle" label="Vehicle" />
        <Tab name="predictions" label="Predictions" />
      </TabList>
      <TabPanel name="vehicle">
        <VehicleSettings />
      </TabPanel>
      <TabPanel name="predictions">
        <PredictionsSettings />
      </TabPanel>
    </SettingsTabs>
  )
}

export { Settings }
