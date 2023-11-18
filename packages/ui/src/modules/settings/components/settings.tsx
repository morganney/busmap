import styled from 'styled-components'
import { Tabs, TabList, Tab, TabPanel } from '@busmap/components/tabs'
import { PB50T, PB90T } from '@busmap/components/colors'

import { Page } from '@core/components/page.js'

import { ThemeSettings } from './theme.js'
import { VehicleSettings } from './vehicle.js'
import { PredictionsSettings } from './predictions.js'

import { useTheme } from '../contexts/theme.js'

import type { FC } from 'react'

const SettingsTabs = styled(Tabs)`
  button {
    text-align: right;
  }
`
const Settings: FC = () => {
  const { mode } = useTheme()
  const background = mode === 'dark' ? PB50T : undefined
  const color = mode === 'dark' ? PB90T : undefined

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
