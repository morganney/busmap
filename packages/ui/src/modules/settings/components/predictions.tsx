import styled from 'styled-components'
import { useCallback } from 'react'
import { isAPredictionFormat } from '@busmap/common/util'

import { FormItem } from '@core/components/formItem.js'
import { useStorageDispatch } from '@core/contexts/storage.js'

import { usePredictionsSettings } from '../contexts/predictions.js'

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
    line-height: 1;
    font-weight: 600;
  }
`
const PredictionsSettings: FC = () => {
  const storageDispatch = useStorageDispatch()
  const { format, persistentOverlay } = usePredictionsSettings()
  const onChangeFormat = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.currentTarget

      if (isAPredictionFormat(value)) {
        storageDispatch({
          value,
          type: 'predsFormat'
        })
      }
    },
    [storageDispatch]
  )
  const onChangePersistentOverlay = useCallback(() => {
    const value = !persistentOverlay

    storageDispatch({
      value,
      type: 'predsPersistentOverlay'
    })
  }, [storageDispatch, persistentOverlay])

  return (
    <Form
      onSubmit={evt => {
        evt.preventDefault()
      }}>
      <FormItem
        label="Persistent overlay"
        direction="horizontal-rev"
        justifyContent="flex-end"
        fontWeight="normal">
        <input
          type="checkbox"
          name="visible"
          checked={persistentOverlay}
          onChange={onChangePersistentOverlay}
        />
      </FormItem>
      <fieldset className="row">
        <legend>Format</legend>
        <FormItem
          label='minutes ("3 min")'
          fontWeight="normal"
          direction="horizontal-rev">
          <input
            type="radio"
            name="format"
            value="minutes"
            checked={format === 'minutes'}
            onChange={onChangeFormat}
          />
        </FormItem>
        <FormItem label='time ("2:05pm")' fontWeight="normal" direction="horizontal-rev">
          <input
            type="radio"
            name="format"
            value="time"
            checked={format === 'time'}
            onChange={onChangeFormat}
          />
        </FormItem>
      </fieldset>
    </Form>
  )
}

export { PredictionsSettings }
