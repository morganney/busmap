import { Expand } from './mod.js'

import type { StoryFn } from '@storybook/react'

const Primary: StoryFn<typeof Expand> = args => {
  return <Expand {...args} />
}

export default {
  title: 'Icons/Expand',
  component: Expand,
  args: {
    outlined: false,
    size: 'medium',
    color: '#c1c1c1',
    tabIndex: 0
  },
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
