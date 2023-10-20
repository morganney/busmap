import styled from 'styled-components'
import { useCallback } from 'react'
import { Tooltip } from '@busmap/components/tooltip'

import { FormItem } from '../formItem.js'
import { useSettings } from '../../contexts/settings/index.js'

import type { FC, ChangeEvent } from 'react'
import type { SpeedUnit } from '../../contexts/settings/index.js'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  fieldset {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px 15px;
    border-radius: 5px;
    border-width: 1px;
    margin: 0;
  }
  fieldset.row {
    flex-direction: row;
    flex-wrap: wrap;
  }
  legend {
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
  }
`
const VehicleSettings: FC = () => {
  const { vehicle } = useSettings()
  const onTogglePredictedVehicles = useCallback(() => {
    vehicle.dispatch({
      type: 'markPredictedVehicles',
      value: !vehicle.markPredictedVehicles
    })
  }, [vehicle])
  const onToggleHideOtherDirections = useCallback(() => {
    vehicle.dispatch({
      type: 'hideOtherDirections',
      value: !vehicle.hideOtherDirections
    })
  }, [vehicle])
  const onChangeSpeedUnit = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      vehicle.dispatch({
        type: 'speedUnit',
        value: evt.currentTarget.value as SpeedUnit
      })
    },
    [vehicle]
  )
  const onChangeVisible = useCallback(() => {
    vehicle.dispatch({
      type: 'visibile',
      value: !vehicle.visible
    })
  }, [vehicle])

  return (
    <Form
      onSubmit={evt => {
        evt.preventDefault()
      }}>
      <FormItem
        label="Visible"
        direction="horizontal-rev"
        justifyContent="flex-end"
        fontWeight="normal">
        <input type="checkbox" checked={vehicle.visible} onChange={onChangeVisible} />
      </FormItem>
      <FormItem
        label="Color predicted"
        direction="horizontal-rev"
        justifyContent="flex-end"
        fontWeight="normal">
        <input
          type="checkbox"
          disabled={!vehicle.visible}
          checked={vehicle.markPredictedVehicles}
          onChange={onTogglePredictedVehicles}
        />
      </FormItem>
      <Tooltip title="Depends on accuracy of agency/gps data.">
        <FormItem
          label="Hide other directions"
          direction="horizontal-rev"
          justifyContent="flex-end"
          fontWeight="normal">
          <input
            type="checkbox"
            disabled={!vehicle.visible}
            checked={vehicle.hideOtherDirections}
            onChange={onToggleHideOtherDirections}
          />
        </FormItem>
      </Tooltip>
      <fieldset className="row">
        <legend>Speed units</legend>
        <FormItem label="kph" fontWeight="normal" direction="horizontal-rev">
          <input
            type="radio"
            name="speedUnit"
            value="kph"
            disabled={!vehicle.visible}
            checked={vehicle.speedUnit === 'kph'}
            onChange={onChangeSpeedUnit}
          />
        </FormItem>
        <FormItem label="mph" fontWeight="normal" direction="horizontal-rev">
          <input
            type="radio"
            name="speedUnit"
            value="mph"
            disabled={!vehicle.visible}
            checked={vehicle.speedUnit === 'mph'}
            onChange={onChangeSpeedUnit}
          />
        </FormItem>
      </fieldset>
    </Form>
  )
}

export { VehicleSettings }
