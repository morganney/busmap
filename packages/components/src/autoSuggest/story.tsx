import { useCallback, useState } from 'react'

import { AutoSuggest } from './mod.js'

import type { StoryFn } from '@storybook/react'

const useSelection = <T,>(initial: T) => {
  const [selected, setSelected] = useState<T>(initial)
  const onSelect = useCallback((selection: T) => {
    setSelected(selection)
  }, [])

  return { selected, onSelect }
}
const Primary: StoryFn<typeof AutoSuggest<string>> = args => {
  const { selected, onSelect } = useSelection<string>('')
  const onClear = useCallback(() => {
    onSelect('')
  }, [onSelect])

  return (
    <>
      <p>Selected: {selected || 'N/A'}</p>
      <AutoSuggest {...args} onSelect={onSelect} onClear={onClear} />
    </>
  )
}
const InitialValue: StoryFn<typeof AutoSuggest<string>> = args => {
  const { selected, onSelect } = useSelection<string>('Hannah')

  return (
    <>
      <p>Selected: {selected || 'N/A'}</p>
      <AutoSuggest {...args} onSelect={onSelect} value="Hannah" />
    </>
  )
}
interface Agency {
  id: string
  title: string
  region: string
}
const ItemsAsObject: StoryFn<typeof AutoSuggest<Agency>> = args => {
  const items: Agency[] = [
    {
      id: 'sfmuni-sandbox',
      title: 'San Francisco Muni Sandbox',
      region: 'California-Northern'
    },
    {
      id: 'ttc',
      title: 'Toronto Transit Commission',
      region: 'Ontario'
    },
    {
      id: 'indianapolis-air',
      title: 'Indianapolis International Airport',
      region: 'Indiana'
    }
  ]
  const { selected, onSelect } = useSelection<Agency | null>(items[0])

  return (
    <>
      <p>Selected: {selected?.id ?? 'N/A'}</p>
      <AutoSuggest
        {...args}
        items={items}
        value={items[0]}
        onSelect={onSelect}
        inputBoundByItems
        caseInsensitive
      />
    </>
  )
}
const InputBoundByItems: StoryFn<typeof AutoSuggest<string>> = args => {
  const { selected, onSelect } = useSelection<string>('')
  const onClear = useCallback(() => {
    onSelect('')
  }, [onSelect])

  return (
    <>
      <p>Selected: {selected || 'N/A'}</p>
      <AutoSuggest
        {...args}
        items={['one', 'two', 'three', 'thrice', 'thence', 'throw']}
        onSelect={onSelect}
        onClear={onClear}
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
    onClear: true,
    caseInsensitive: false,
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
    },
    caseInsensitive: {
      control: 'boolean'
    }
  }
}
export { Primary, InitialValue, ItemsAsObject, InputBoundByItems }
