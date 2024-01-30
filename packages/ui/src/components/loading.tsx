import styled from 'styled-components'

import { Dots } from './dots.js'

import type { FC } from 'react'

interface LoadingProps {
  text: string
  useIcon?: boolean
}

const Text = styled.p`
  z-index: 999;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  align-items: center;
  justify-content: center;
  font-family: Roboto, Arial, sans-serif;
  font-size: 1.8rem;
`
const Loading: FC<LoadingProps> = ({ text, useIcon = true }) => {
  return (
    <Text>
      <span>
        {text} {useIcon && <Dots />}
      </span>
    </Text>
  )
}

export { Loading }
