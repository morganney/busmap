import styled from 'styled-components'

import { SLB30T } from '../colors.js'

import type { KeyboardEvent } from 'react'
import type { Size } from '../types.js'

interface IconProps {
  color?: string
  size?: Size
  onClick?: () => void
  onKeyDown?: (evt: KeyboardEvent<HTMLSpanElement>) => void
  className?: string
  tabIndex?: number
}

const getSizing = (size: Size) => {
  switch (size) {
    case 'small':
      return '16px'
    case 'medium':
      return '24px'
    case 'large':
      return '32px'
  }
}
const Icon = styled.span<{ size: Size; color: string; fill?: string; cursor?: string }>`
  display: flex;
  width: ${({ size }) => getSizing(size)};
  height: ${({ size }) => getSizing(size)};
  color: ${({ color }) => color};
  cursor: ${({ cursor }) => cursor ?? 'pointer'};
  justify-content: center;

  svg {
    fill: ${({ fill }) => fill ?? 'currentcolor'};
  }

  &:focus-visible {
    outline: none;
    border: 1px solid ${SLB30T};
    border-radius: 50%;
  }
`

export { getSizing, Icon }
export type { IconProps }
