import { SignOut } from './mod.js'

import type { StoryFn } from '@storybook/react'

const Primary: StoryFn<typeof SignOut> = args => {
  return <SignOut {...args} />
}

export default {
  title: 'Icons/SignOut',
  component: SignOut,
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
