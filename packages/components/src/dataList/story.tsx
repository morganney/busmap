import { DataList } from './mod.js'

import type { StoryObj } from '@storybook/react'

type Story = StoryObj<typeof DataList>

const Primary: Story = {
  args: {
    placeholder: 'enter text to search',
    items: ['one', 'two', 'three', 'four'],
  },
  argTypes: {
    onChange: {
      action: 'onChange',
    },
  },
}

export default {
  title: 'DataList',
  component: DataList,
}
export { Primary }
