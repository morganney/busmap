import { Loading } from './mod.js'

import type { StoryFn } from '@storybook/react'

const Primary: StoryFn<typeof Loading> = args => {
  return <Loading {...args} />
}
const Example: StoryFn<typeof Loading> = args => {
  return (
    <p>
      Signing you in <Loading {...args} />
    </p>
  )
}

export default {
  title: 'Loading',
  component: Loading,
  args: {
    color: '#265A87',
    size: 'small',
    display: 'inline-block',
    indent: 0
  },
  argTypes: {
    color: {
      control: 'color'
    },
    size: {
      control: 'select',
      options: ['small', 'medium']
    },
    display: {
      control: 'select',
      options: ['inline-block', 'block']
    },
    indent: {
      control: 'number'
    }
  }
}
export { Primary, Example }
