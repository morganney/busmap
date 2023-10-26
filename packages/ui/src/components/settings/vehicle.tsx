import styled from 'styled-components'
import { useCallback } from 'react'

import { FormItem } from '../formItem.js'
import { useSettings } from '../../contexts/settings/index.js'
import { useStorageDispatch } from '../../contexts/storage.js'
import { isASpeedUnit } from '../../contexts/settings/vehicle.js'

import type { FC, ChangeEvent } from 'react'

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
    flex-flow: row wrap;
  }

  legend {
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
  }
`
const VehicleSettings: FC = () => {
  const { vehicle } = useSettings()
  const storageDispatch = useStorageDispatch()
  const onTogglePredictedVehicles = useCallback(() => {
    const value = !vehicle.markPredictedVehicles

    storageDispatch({
      value,
      type: 'vehicleColorPredicted'
    })
    vehicle.dispatch({
      value,
      type: 'markPredictedVehicles'
    })
  }, [vehicle, storageDispatch])
  const onToggleHideOtherDirections = useCallback(() => {
    vehicle.dispatch({
      type: 'hideOtherDirections',
      value: !vehicle.hideOtherDirections
    })
  }, [vehicle])
  const onChangeSpeedUnit = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.currentTarget

      if (isASpeedUnit(value)) {
        storageDispatch({
          value,
          type: 'vehicleSpeedUnit'
        })
        vehicle.dispatch({
          value,
          type: 'speedUnit'
        })
      }
    },
    [vehicle, storageDispatch]
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
        <input
          type="checkbox"
          name="visible"
          checked={vehicle.visible}
          onChange={onChangeVisible}
        />
      </FormItem>
      <FormItem
        label="Color predicted"
        direction="horizontal-rev"
        justifyContent="flex-end"
        fontWeight="normal">
        <input
          type="checkbox"
          name="colorPredicted"
          disabled={!vehicle.visible}
          checked={vehicle.markPredictedVehicles}
          onChange={onTogglePredictedVehicles}
        />
      </FormItem>
      <FormItem
        label="Hide other directions"
        tip="Depends on accuracy of agency/gps data."
        direction="horizontal-rev"
        justifyContent="flex-end"
        fontWeight="normal">
        <input
          type="checkbox"
          name="hideOther"
          disabled={!vehicle.visible}
          checked={vehicle.hideOtherDirections}
          onChange={onToggleHideOtherDirections}
        />
      </FormItem>
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
