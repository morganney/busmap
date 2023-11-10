import { Male } from './mod.js'

import type { StoryFn } from '@storybook/react'

const Primary: StoryFn<typeof Male> = args => {
  return <Male {...args} />
}

export default {
  title: 'Icons/Male',
  component: Male,
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
