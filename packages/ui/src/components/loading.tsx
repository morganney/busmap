import styled from 'styled-components'

import type { FC } from 'react'

interface LoadingProps {
  text: string
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
  font-size: 1rem;
`
const Loading: FC<LoadingProps> = ({ text }) => {
  return (
    <Text>
      <span>{text}</span>
    </Text>
  )
}

export { Loading }
