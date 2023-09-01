import { StoryObj } from '@storybook/react'

import { ClearIcon } from './mod.js'

type Story = StoryObj<typeof ClearIcon>

const Primary: Story = {
  args: {
    size: 'medium',
    color: '#c1c1c199',
  },
}
export default {
  title: 'ClearIcon',
  component: ClearIcon,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: 'color',
    },
    onClick: {
      action: 'onClick',
    },
  },
}

export { Primary }
