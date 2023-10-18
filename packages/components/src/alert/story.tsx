import { useState } from 'react'

import { Alert } from './mod.js'

import type { StoryFn } from '@storybook/react'

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

export { Primary, Close }
export default {
  title: 'Alert',
  component: Alert,
  args: {
    message: 'An alert message',
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
    }
  }
}
