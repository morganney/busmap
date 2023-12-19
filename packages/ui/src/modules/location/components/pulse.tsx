import styled, { keyframes } from 'styled-components'
import { SLB20T, PB20T } from '@busmap/components/colors'

import { useTheme } from '@module/settings/contexts/theme.js'

import type { FC } from 'react'
import type { Mode } from '@busmap/common/types/settings'

const pulse = (mode: Mode) => keyframes`
  from {
    box-shadow: 0 0 0 0 ${mode === 'light' ? `${PB20T}33` : '#ffffff33'};
  }
  to {
    box-shadow: 0 0 0 8px ${mode === 'light' ? `${PB20T}00` : '#ffffff00'};
  }
`
const Circle = styled.span<{ mode: Mode }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid ${SLB20T};
  background: ${SLB20T}66;
  box-shadow: 0 0 1px 1px ${({ mode }) => (mode === 'light' ? `${PB20T}1a` : '#ffffff1a')};
  animation: ${({ mode }) => pulse(mode)} 2s infinite;
`
const Pulse: FC = () => {
  const { mode } = useTheme()

  return <Circle mode={mode} />
}

export { Pulse }
