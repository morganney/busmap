import { StoryObj } from '@storybook/react'

import { ChevronDown } from './mod.js'

type Story = StoryObj<typeof ChevronDown>

const Primary: Story = {
  args: {
    size: 'medium',
    color: '#c1c1c1'
  }
}
export default {
  title: 'Icons/ChevronDown',
  component: ChevronDown,
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
