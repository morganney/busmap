import styled from 'styled-components'

import type { FC } from 'react'

import { SLB30T } from '../colors.js'
import type { Size } from '../types.js'

interface ChevronDownProps {
  color?: string
  size?: Size
  className?: string
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
const Icon = styled.span<{ $size: Size; $color: string }>`
  display: flex;
  width: ${({ $size }) => getSizing($size)};
  height: ${({ $size }) => getSizing($size)};
  color: ${({ $color }) => $color};
  cursor: pointer;

  svg {
    fill: currentColor;
  }

  &:focus-visible {
    outline: none;
    border: 1px solid ${SLB30T};
    border-radius: 50%;
  }

  &.isOpen {
    transform: rotate(180deg);
  }
`
const ChevronDown: FC<ChevronDownProps> = ({
  className,
  size = 'medium',
  color = '#c1c1c1',
}) => {
  return (
    <Icon $color={color} $size={size} className={className}>
      <svg viewBox="0 0 32 32">
        <g>
          <line x1="16" x2="7" y1="20.5" y2="11.5" stroke={color} strokeWidth="2" />
          <line x1="25" x2="16" y1="11.5" y2="20.5" stroke={color} strokeWidth="2" />
        </g>
      </svg>
    </Icon>
  )
}

export { ChevronDown }
