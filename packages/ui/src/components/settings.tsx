import styled from 'styled-components'
import { useCallback } from 'react'

import { FormItem } from './formItem.js'

import { useSettings } from '../contexts/settings/index.js'

import type { FC, ChangeEvent } from 'react'
import type { SpeedUnit } from '../contexts/settings/index.js'

const Form = styled.form`
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;
  }

  fieldset.row {
    flex-direction: row;
    gap: 10px;
  }
  legend {
    font-size: 14px;
    line-height: 1;
  }
`
const Settings: FC = () => {
  const settings = useSettings()
  const onTogglePredictedVehicles = useCallback(() => {
    settings.vehicle.dispatch({
      type: 'markPredictedVehicles',
      value: !settings.vehicle.markPredictedVehicles
    })
  }, [settings.vehicle])
  const onChangeSpeedUnit = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      settings.vehicle.dispatch({
        type: 'speedUnit',
        value: evt.currentTarget.value as SpeedUnit
      })
    },
    [settings.vehicle]
  )

  return (
    <Form
      onSubmit={evt => {
        evt.preventDefault()
      }}>
      <fieldset>
        <legend>Vehicles</legend>
        <FormItem
          label="Color predicted"
          direction="horizontal-rev"
          justifyContent="flex-end"
          fontWeight="normal"
          grow={0}>
          <input
            type="checkbox"
            checked={settings.vehicle.markPredictedVehicles}
            onChange={onTogglePredictedVehicles}
          />
        </FormItem>
        <fieldset className="row">
          <legend>Speed units</legend>
          <FormItem label="kph" fontWeight="normal" direction="horizontal">
            <input
              type="radio"
              name="speedUnit"
              value="kph"
              checked={settings.vehicle.speedUnit === 'kph'}
              onChange={onChangeSpeedUnit}
            />
          </FormItem>
          <FormItem label="mph" fontWeight="normal" direction="horizontal">
            <input
              type="radio"
              name="speedUnit"
              value="mph"
              checked={settings.vehicle.speedUnit === 'mph'}
              onChange={onChangeSpeedUnit}
            />
          </FormItem>
        </fieldset>
      </fieldset>
    </Form>
  )
}

export { Settings }
