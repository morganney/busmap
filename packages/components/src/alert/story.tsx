import styled from 'styled-components'
import { useState } from 'react'

import { Alert } from './mod.js'

import { StreetView } from '../icons/streetView/mod.js'
import { Tooltip } from '../tooltip/mod.js'

import type { StoryFn } from '@storybook/react'

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Btn = styled.button`
  background: none;
  padding: 3px 6px;
  margin: 0;
  border: 1px solid black;
  cursor: pointer;
  display: flex;
  gap: 4px;
  align-items: center;
`
const Primary: StoryFn<typeof Alert> = args => {
  return <Alert {...args} />
}
const Close: StoryFn<typeof Alert> = args => {
  const [open, setOpen] = useState(true)

  if (open) {
    return <Alert {...args} onClose={() => setOpen(false)} />
  }

  return <button onClick={() => setOpen(true)}>re-open</button>
}
const Button: StoryFn<typeof Alert> = args => {
  return (
    <Alert {...args}>
      <Wrap>
        <span>Do something now with this information</span>
        <Tooltip title="Locate me">
          <Btn>
            <span>Locate me</span>
            <StreetView size="small" />
          </Btn>
        </Tooltip>
      </Wrap>
    </Alert>
  )
}
const CustomIcon: StoryFn<typeof Alert> = args => {
  return <Alert {...args} icon={<StreetView />} />
}

export { Primary, Close, Button, CustomIcon }
export default {
  title: 'Alert',
  component: Alert,
  args: {
    children: 'An alert message',
    type: 'info',
    variant: 'standard'
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error']
    },
    variant: {
      control: 'select',
      options: ['filled', 'standard', 'outlined']
    },
    icon: {
      control: false
    }
  }
}
