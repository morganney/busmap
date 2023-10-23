import styled from 'styled-components'
import { useCallback } from 'react'

import { FormItem } from '../formItem.js'
import { useSettings } from '../../contexts/settings/index.js'
import { isAPredictionFormat } from '../../contexts/settings/predictions.js'
import { STORAGE_KEYS } from '../../common.js'

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
  const { predictions } = useSettings()
  const onChangeFormat = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.currentTarget

      if (isAPredictionFormat(value)) {
        localStorage.setItem(STORAGE_KEYS.predictionsFormat, value)
        predictions.dispatch({
          value,
          type: 'format'
        })
      }
    },
    [predictions]
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
            checked={predictions.format === 'minutes'}
            onChange={onChangeFormat}
          />
        </FormItem>
        <FormItem label='time ("2:05pm")' fontWeight="normal" direction="horizontal-rev">
          <input
            type="radio"
            name="format"
            value="time"
            checked={predictions.format === 'time'}
            onChange={onChangeFormat}
          />
        </FormItem>
      </fieldset>
    </Form>
  )
}

export { PredictionsSettings }
