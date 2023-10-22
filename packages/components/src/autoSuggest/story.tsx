import { useCallback, useState } from 'react'

import { AutoSuggest } from './mod.js'

import { PB50T } from '../colors.js'

import type { StoryFn } from '@storybook/react'
import type { SetInputText } from './mod.js'

interface Agency {
  id: string
  title: string
  region: string
}
interface Direction {
  id: string
  title: string
  shortTitle: string | null
}

const useSelection = <T,>(initial: T) => {
  const [selected, setSelected] = useState<T>(initial)
  const onSelect = useCallback((selection: T) => {
    setSelected(selection)
  }, [])

  return { selected, onSelect }
}
const Primary: StoryFn<typeof AutoSuggest<string>> = args => {
  const { selected, onSelect } = useSelection<string>('')
  const onClear = useCallback(
    (clearItem: () => void) => {
      clearItem()
      onSelect('')
    },
    [onSelect]
  )
  const { onBlur, ...rest } = args

  return (
    <>
      <p>Selected: {selected || 'N/A'}</p>
      <AutoSuggest {...rest} onSelect={onSelect} onClear={onClear} selectOnTextMatch />
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
  const onBlur = useCallback(
    (selected: Agency | null, inputText: string, setInputText: SetInputText) => {
      if (selected && inputText !== selected.title) {
        setInputText(selected.title)
      }
    },
    []
  )

  return (
    <>
      <p>Selected: {selected?.id ?? 'N/A'}</p>
      <AutoSuggest
        {...args}
        items={items}
        value={selected ?? undefined}
        onBlur={onBlur}
        onSelect={onSelect}
        inputBoundByItems
        caseInsensitive
      />
    </>
  )
}
const ItemToString: StoryFn<typeof AutoSuggest<Direction>> = args => {
  const items: Direction[] = [
    {
      id: '7_0_7',
      title: 'South - 7 Bathurst towards Bathurst Station',
      shortTitle: 'South'
    },
    {
      id: '7_1_7',
      title: 'North - 7 Bathurst towards Steeles',
      shortTitle: 'North'
    }
  ]
  const [selected, onSelect] = useState<Direction>()
  const itemToString = useCallback((item: Direction | null) => {
    return item?.shortTitle ?? ''
  }, [])
  const onClear = useCallback(
    (clearItem: () => void) => {
      clearItem()
      onSelect(undefined)
    },
    [onSelect]
  )

  return (
    <>
      <p>Selected: {selected?.title ?? 'N/A'}</p>
      <AutoSuggest
        {...args}
        items={items}
        onClear={onClear}
        onSelect={onSelect}
        itemToString={itemToString}
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
    selectOnTextMatch: false,
    caseInsensitive: false,
    items: ['Hannah', 'Emma', 'Rebecca'],
    size: 'medium',
    inputBoundByItems: false,
    isDisabled: false,
    color: '#000000',
    placeholder: 'type to search...',
    placeholderColor: PB50T,
    background: '#ffffff'
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
    placeholderColor: {
      control: 'color'
    },
    background: {
      control: 'color'
    },
    onChange: {
      action: 'onChange'
    },
    onBlur: {
      action: 'onBlur'
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
    itemToString: {
      control: false
    },
    caseInsensitive: {
      control: 'boolean'
    }
  }
}
export { Primary, InitialValue, ItemsAsObject, InputBoundByItems, ItemToString }
