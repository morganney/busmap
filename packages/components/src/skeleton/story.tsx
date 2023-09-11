import { Skeleton } from './mod.js'

import type { StoryFn } from '@storybook/react'

type Story = StoryFn<typeof Skeleton>

const Primary: Story = args => {
  return <Skeleton {...args} />
}

export default {
  title: 'Skeleton',
  component: Skeleton,
  args: {
    isAnimated: true,
    width: '125px',
    height: '14px',
    circle: false,
    display: 'block',
    duration: 1.2
  },
  argTypes: {
    display: {
      control: 'select',
      options: ['inline-block', 'block']
    },
    radius: {
      control: 'text'
    }
  }
}

export { Primary }
