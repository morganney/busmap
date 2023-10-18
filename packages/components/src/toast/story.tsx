import { useCallback } from 'react'
import styled from 'styled-components'

import { Toaster, toast } from './mod.js'

import type { StoryFn } from '@storybook/react'
import type { ToasterProps } from './mod.js'

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
`
const Primary: StoryFn<typeof Toaster> = args => {
  const onClick = useCallback(() => {
    toast({ ...args } as ToasterProps)
  }, [args])

  return (
    <>
      <Toaster {...args} />
      <ButtonGroup>
        <button onClick={onClick}>open toast</button>
      </ButtonGroup>
    </>
  )
}

export default {
  title: 'Toaster',
  component: Toaster,
  args: {
    type: 'info',
    variant: 'standard',
    message: 'A toast message',
    position: 'bottom left',
    timeout: 6_000
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error']
    },
    variant: {
      control: 'select',
      options: ['standard', 'filled', 'outlined']
    },
    position: {
      control: 'select',
      options: [
        'top left',
        'top center',
        'top right',
        'bottom left',
        'bottom center',
        'bottom right'
      ]
    }
  }
}
export { Primary }
