import { useState, useCallback, useRef } from 'react'

import { Input } from './mod.js'

import type { StoryFn } from '@storybook/react'
import type { ChangeEvent } from 'react'

const Single: StoryFn<typeof Input> = args => {
  const ref = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value)
  }, [])
  const onClear = useCallback(() => {
    setValue('')

    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  return (
    <Input
      {...args}
      ref={ref}
      value={value}
      onChange={onChange}
      onClear={onClear}
      placeholder="enter text..."
    />
  )
}

export default {
  title: 'Input',
  component: Input,
  args: {
    size: 'medium',
    placeholder: 'placeholder',
  },
  argTypes: {
    id: {
      table: {
        disable: true,
      },
    },
    list: {
      table: {
        disable: true,
      },
    },
    labelledBy: {
      table: {
        disable: true,
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    fontSize: {
      control: 'text',
    },
    isDisabled: {
      control: 'boolean',
    },
    color: {
      control: 'color',
    },
    borderColor: {
      control: 'color',
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
  },
}
export { Single }
