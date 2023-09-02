import { useCallback, useState } from 'react'
import styled from 'styled-components'
import type { StoryFn } from '@storybook/react'
import type { ChangeEvent, FC } from 'react'

import { AutoSuggest } from './mod.js'

type Story = StoryFn<typeof AutoSuggest>

const Dl = styled.dl`
  margin: 0 0 5px 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  dt::after {
    content: ':';
  }
  dd {
    margin: 0;
  }
`
const Selection: FC<{ selection: string }> = ({ selection }) => {
  return (
    <Dl>
      <dt>Selected</dt>
      <dd>{selection || 'None'}</dd>
    </Dl>
  )
}
const useSelection = () => {
  const [selected, setSelected] = useState('')
  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setSelected(evt.target.value)
  }, [])

  return { selected, onChange }
}
const Primary: Story = args => {
  const { selected, onChange } = useSelection()

  return (
    <>
      <Selection selection={selected} />
      <AutoSuggest {...args} onChange={onChange} />
    </>
  )
}
const InputBoundByItems: Story = args => {
  const { selected, onChange } = useSelection()

  return (
    <>
      <Selection selection={selected} />
      <AutoSuggest
        {...args}
        items={['one', 'two', 'three', 'thrice', 'thence', 'throw']}
        onChange={onChange}
        inputBoundByItems
      />
    </>
  )
}
InputBoundByItems.argTypes = {
  inputBoundByItems: {
    control: false,
  },
}
export default {
  title: 'AutoSuggest',
  component: AutoSuggest,
  args: {
    items: ['Hannah', 'Emma', 'Rebecca'],
    size: 'medium',
    inputBoundByItems: false,
    isDisabled: false,
    color: '#000000',
    placeholder: 'type to search...',
  },
  argTypes: {
    items: {
      control: false,
    },
    value: {
      control: false,
    },
    placeholder: {
      control: 'text',
    },
    onChange: {
      action: 'onChange',
    },
    isDisabled: {
      control: 'boolean',
    },
    color: {
      control: 'color',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    preload: {
      control: false,
    },
    loadItems: {
      control: false,
    },
  },
}
export { Primary, InputBoundByItems }
