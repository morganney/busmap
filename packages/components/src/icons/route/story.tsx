import { Route } from './mod.js'

import type { StoryFn } from '@storybook/react'

const Primary: StoryFn<typeof Route> = args => {
  return <Route {...args} />
}

export default {
  title: 'Icons/Route',
  component: Route,
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
