import { StoryObj } from '@storybook/react'

import { Locate } from './mod.js'

type Story = StoryObj<typeof Locate>

const Primary: Story = {
  args: {
    size: 'medium',
    color: '#c1c1c199'
  }
}
export default {
  title: 'Icons/Locate',
  component: Locate,
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
