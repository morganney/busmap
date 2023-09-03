import { StoryObj } from '@storybook/react'

import { Clear } from './mod.js'

type Story = StoryObj<typeof Clear>

const Primary: Story = {
  args: {
    size: 'medium',
    color: '#c1c1c199'
  }
}
export default {
  title: 'Icons/ClearIcon',
  component: Clear,
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
