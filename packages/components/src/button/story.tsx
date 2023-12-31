import { Button } from './mod.js'

import type { StoryFn } from '@storybook/react'

const Primary: StoryFn<typeof Button> = args => {
  return <Button {...args} />
}

export default {
  title: 'Button',
  component: Button,
  args: {
    children: 'Some button text',
    display: 'light',
    variant: 'solid',
    isDisabled: false
  },
  argTypes: {
    onClick: {
      action: 'onClick'
    },
    display: {
      control: 'select',
      options: ['light', 'dark']
    },
    variant: {
      control: 'select',
      options: ['outlined', 'solid']
    }
  }
}
export { Primary }
