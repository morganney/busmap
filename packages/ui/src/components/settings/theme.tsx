import styled from 'styled-components'
import { useCallback } from 'react'

import { FormItem } from '../formItem.js'
import { useSettings } from '../../contexts/settings/index.js'
import { isAMode } from '../../contexts/settings/theme.js'
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
const ThemeSettings: FC = () => {
  const { theme } = useSettings()
  const onChangeMode = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.currentTarget

      if (isAMode(value)) {
        localStorage.setItem(STORAGE_KEYS.themeMode, value)
        theme.dispatch({
          value,
          type: 'mode'
        })
      }
    },
    [theme]
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
            checked={theme.mode === 'light'}
            onChange={onChangeMode}
          />
        </FormItem>
        <FormItem label="dark" fontWeight="normal" direction="horizontal-rev">
          <input
            type="radio"
            name="mode"
            value="dark"
            checked={theme.mode === 'dark'}
            onChange={onChangeMode}
          />
        </FormItem>
      </fieldset>
    </Form>
  )
}

export { ThemeSettings }