import styled from 'styled-components'
import { useCallback } from 'react'

import { FormItem } from './formItem.js'

import { useSettings } from '../contexts/settings/index.js'

import type { FC } from 'react'

const Form = styled.form``
const Settings: FC = () => {
  const settings = useSettings()
  const onTogglePredictedVehicles = useCallback(() => {
    settings.vehicle.dispatch({
      type: 'markPredictedVehicles',
      value: !settings.vehicle.markPredictedVehicles
    })
  }, [settings.vehicle])

  return (
    <Form
      onSubmit={evt => {
        evt.preventDefault()
      }}>
      <FormItem
        label="Color predicted vehicles"
        direction="horizontal-rev"
        justifyContent="flex-end"
        fontWeight="normal"
        fontSize="12px"
        grow={0}>
        <input
          type="checkbox"
          checked={settings.vehicle.markPredictedVehicles}
          onChange={onTogglePredictedVehicles}
        />
      </FormItem>
    </Form>
  )
}

export { Settings }
