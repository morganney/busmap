import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { AutoSuggest } from './mod.js'

import type { AnItem } from './mod.js'
import type { StoryFn } from '@storybook/react'
import type { FC } from 'react'

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
const Selection: FC<{ selection: AnItem }> = ({ selection }) => {
  return (
    <Dl>
      <dt>Selected</dt>
      <dd>{typeof selection === 'string' ? selection : selection.value}</dd>
    </Dl>
  )
}
const useSelection = () => {
  const [selected, setSelected] = useState<AnItem>('')
  const onSelect = useCallback((selection: AnItem) => {
    setSelected(selection)
  }, [])

  return { selected, onSelect }
}
const Primary: Story = args => {
  const { selected, onSelect } = useSelection()

  return (
    <>
      <Selection selection={selected} />
      <AutoSuggest {...args} onSelect={onSelect} />
    </>
  )
}
const ItemsAsObject: Story = args => {
  const { selected, onSelect } = useSelection()
  const items = [
    {
      label: 'One',
      value: '1'
    },
    {
      label: 'Two',
      value: '2'
    },
    {
      label: 'Three',
      value: '3'
    }
  ]

  return (
    <>
      <Selection selection={selected} />
      <AutoSuggest {...args} items={items} onSelect={onSelect} inputBoundByItems />
    </>
  )
}
const InputBoundByItems: Story = args => {
  const { selected, onSelect } = useSelection()

  return (
    <>
      <Selection selection={selected} />
      <AutoSuggest
        {...args}
        items={['one', 'two', 'three', 'thrice', 'thence', 'throw']}
        onSelect={onSelect}
        inputBoundByItems
      />
    </>
  )
}
InputBoundByItems.argTypes = {
  inputBoundByItems: {
    control: false
  }
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
    placeholder: 'type to search...'
  },
  argTypes: {
    items: {
      control: false
    },
    value: {
      control: false
    },
    placeholder: {
      control: 'text'
    },
    onChange: {
      action: 'onChange'
    },
    isDisabled: {
      control: 'boolean'
    },
    color: {
      control: 'color'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    preload: {
      control: false
    },
    loadItems: {
      control: false
    }
  }
}
export { Primary, InputBoundByItems, ItemsAsObject }
