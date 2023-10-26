import styled from 'styled-components'
import { useCallback } from 'react'

import { FormItem } from '../formItem.js'
import { useStorageDispatch } from '../../contexts/storage.js'
import { usePredictionsSettings } from '../../contexts/settings/predictions.js'
import { isAPredictionFormat } from '../../contexts/util.js'

import type { FC, ChangeEvent } from 'react'

const Form = styled.form`
  display: flex;
  flex-direction: column;

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
  const { format, dispatch } = usePredictionsSettings()
  const onChangeFormat = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.currentTarget

      if (isAPredictionFormat(value)) {
        storageDispatch({
          value,
          type: 'predsFormat'
        })
        dispatch({
          value,
          type: 'format'
        })
      }
    },
    [dispatch, storageDispatch]
  )

  return (
    <Form
      onSubmit={evt => {
        evt.preventDefault()
      }}>
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
