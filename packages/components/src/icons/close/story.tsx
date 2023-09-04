import { StoryObj } from '@storybook/react'

import { Close } from './mod.js'

type Story = StoryObj<typeof Close>

const Primary: Story = {
  args: {
    size: 'medium',
    color: '#c1c1c199'
  }
}
export default {
  title: 'Icons/CloseIcon',
  component: Close,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    color: {
      control: 'color'
    },
    onClick: {
      action: 'onClick'
    }
  }
}

export { Primary }
