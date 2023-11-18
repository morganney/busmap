import { Compress } from './mod.js'

import type { StoryFn } from '@storybook/react'

const Primary: StoryFn<typeof Compress> = args => {
  return <Compress {...args} />
}

export default {
  title: 'Icons/Compress',
  component: Compress,
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
