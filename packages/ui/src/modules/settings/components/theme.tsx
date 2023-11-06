import styled from 'styled-components'
import { useCallback } from 'react'

import { FormItem } from '@core/components/formItem.js'
import { useStorageDispatch } from '@core/contexts/storage.js'

import { useTheme } from '../contexts/theme.js'
import { isAMode } from '../util.js'

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
const ThemeSettings: FC = () => {
  const { mode, dispatch } = useTheme()
  const storageDispatch = useStorageDispatch()
  const onChangeMode = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.currentTarget

      if (isAMode(value)) {
        storageDispatch({
          value,
          type: 'themeMode'
        })
        dispatch({
          value,
          type: 'mode'
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
        <legend>Mode</legend>
        <FormItem label="light" fontWeight="normal" direction="horizontal-rev">
          <input
            type="radio"
            name="mode"
            value="light"
            checked={mode === 'light'}
            onChange={onChangeMode}
          />
        </FormItem>
        <FormItem label="dark" fontWeight="normal" direction="horizontal-rev">
          <input
            type="radio"
            name="mode"
            value="dark"
            checked={mode === 'dark'}
            onChange={onChangeMode}
          />
        </FormItem>
      </fieldset>
    </Form>
  )
}

export { ThemeSettings }
