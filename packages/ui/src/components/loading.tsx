import styled from 'styled-components'
import { Loading as Dots } from '@busmap/components/loading'
import { PB20T, PB90T } from '@busmap/components/colors'

import { useTheme } from '../modules/settings/contexts/theme.js'

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
  font-size: 1rem;
`
const Loading: FC<LoadingProps> = ({ text, useIcon = true }) => {
  const { mode } = useTheme()

  return (
    <Text>
      <span>
        {text} {useIcon && <Dots indent={2} color={mode === 'dark' ? PB90T : PB20T} />}
      </span>
    </Text>
  )
}

export { Loading }
