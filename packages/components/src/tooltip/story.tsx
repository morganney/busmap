import styled from 'styled-components'

import { Tooltip } from './mod.js'

import type { StoryFn } from '@storybook/react'

const Center = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Primary: StoryFn<typeof Tooltip> = args => {
  return (
    <Center>
      <Tooltip {...args}>Tooltip example</Tooltip>
    </Center>
  )
}

export { Primary }
export default {
  title: 'Tooltip',
  component: Tooltip,
  args: {
    title: 'Story title',
    placement: 'top',
    underline: 'dashed'
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'right', 'left']
    },
    underline: {
      control: 'select',
      options: ['solid', 'double', 'dotted', 'dashed', 'unset']
    }
  }
}
