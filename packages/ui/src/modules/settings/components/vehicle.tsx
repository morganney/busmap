import styled from 'styled-components'
import { useCallback } from 'react'
import { isASpeedUnit } from '@busmap/common/util'

import { FormItem } from '@core/components/formItem.js'
import { useStorageDispatch } from '@core/contexts/storage.js'

import { useVehicleSettings } from '../contexts/vehicle.js'

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
  const { speedUnit, markPredictedVehicles, hideOtherDirections, visible, dispatch } =
    useVehicleSettings()
  const storageDispatch = useStorageDispatch()
  const onTogglePredictedVehicles = useCallback(() => {
    const value = !markPredictedVehicles

    storageDispatch({
      value,
      type: 'vehicleColorPredicted'
    })
    dispatch({
      value,
      type: 'markPredictedVehicles'
    })
  }, [markPredictedVehicles, dispatch, storageDispatch])
  const onToggleHideOtherDirections = useCallback(() => {
    dispatch({
      type: 'hideOtherDirections',
      value: !hideOtherDirections
    })
  }, [hideOtherDirections, dispatch])
  const onChangeSpeedUnit = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.currentTarget

      if (isASpeedUnit(value)) {
        storageDispatch({
          value,
          type: 'vehicleSpeedUnit'
        })
        dispatch({
          value,
          type: 'speedUnit'
        })
      }
    },
    [dispatch, storageDispatch]
  )
  const onChangeVisible = useCallback(() => {
    const value = !visible

    storageDispatch({
      value,
      type: 'vehicleVisible'
    })
    dispatch({
      value,
      type: 'visibile'
    })
  }, [dispatch, storageDispatch, visible])

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
          checked={visible}
          onChange={onChangeVisible}
        />
      </FormItem>
      <FormItem
        label="Color predicted"
        tip="Associates a prediction time with its vehicle via colors."
        direction="horizontal-rev"
        justifyContent="flex-end"
        fontWeight="normal">
        <input
          type="checkbox"
          name="colorPredicted"
          disabled={!visible}
          checked={markPredictedVehicles}
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
          disabled={!visible}
          checked={hideOtherDirections}
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
            disabled={!visible}
            checked={speedUnit === 'kph'}
            onChange={onChangeSpeedUnit}
          />
        </FormItem>
        <FormItem label="mph" fontWeight="normal" direction="horizontal-rev">
          <input
            type="radio"
            name="speedUnit"
            value="mph"
            disabled={!visible}
            checked={speedUnit === 'mph'}
            onChange={onChangeSpeedUnit}
          />
        </FormItem>
      </fieldset>
    </Form>
  )
}

export { VehicleSettings }
